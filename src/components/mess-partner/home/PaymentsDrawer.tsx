import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { getPendingMessPayments } from "../../../apis/mess-partner/getMessPendingPayments.api";
import {
    approveMessPayment,
    rejectMessPayment,
} from "../../../apis/mess-partner/paymentActions.api";
import { useToast } from "../../../context/ToastContext";
interface PendingPayment {
    payment_id: number;
    user_id: string;
    profile_id: number;
    amount: string;
    meal_type: "BREAKFAST" | "LUNCH" | "DINNER";
    default_response: "YES" | "NO";
    utr: string;
    proof_url: string | null;
    status: "PENDING";
    created_at: string;
    updated_at: string;
    mess_name: string;
    user_name: string;
}

interface PaymentsDrawerProps {
    onClose: () => void;
}

const formatMealType = (mealType: PendingPayment["meal_type"]) => {
    return mealType.charAt(0) + mealType.slice(1).toLowerCase();
};

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    });
};

export const PaymentsDrawer: React.FC<PaymentsDrawerProps> = ({
    onClose,
}) => {
    const { getToken } = useAuth();
    const { showToast } = useToast();
    const [payments, setPayments] = useState<PendingPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(null);

    const loadPayments = async () => {
        try {
            setIsLoading(true);
            setError("");

            const token = await getToken();

            if (!token) {
                throw new Error("Authentication token unavailable");
            }

            const result = await getPendingMessPayments(token);

            setPayments(result.data || []);
        } catch (error) {
            console.error("Failed to load pending payments:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load pending payments"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);


    const handlePaymentAction = async (
        paymentId: number,
        action: "approve" | "reject"
    ) => {
        try {
            setProcessingPaymentId(paymentId);

            const token = await getToken();

            if (!token) {
                throw new Error("Authentication token unavailable");
            }

            if (action === "approve") {
                await approveMessPayment(paymentId, token);
                // Replace with your toast success method.
                showToast("Payment approved successfully.", "success");
            } else {
                await rejectMessPayment(paymentId, token);
                showToast("Payment rejected successfully.", "success");
            }

            await loadPayments();
        } catch (error) {
            console.error(`Failed to ${action} payment:`, error);

            showToast(
                error instanceof Error
                    ? error.message
                    : `Failed to ${action} payment. Please try again.`,
                "error"
            );
        } finally {
            setProcessingPaymentId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
            <div
                className="w-full max-w-[430px] bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-4 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-200"
                style={{
                    paddingBottom:
                        "calc(env(safe-area-inset-bottom, 0px) + 16px)",
                }}
            >
                {/* Grab Handle */}
                <div className="w-10 h-1.5 bg-[#D1D5DB] rounded-full mx-auto mb-3" />

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                    <div>
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                            Mess Operations
                        </span>

                        <h2 className="font-heading font-bold text-lg text-[#111827]">
                            Payments
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark text-base" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 py-3 space-y-3">
                    {isLoading && (
                        <div className="py-12 text-center">
                            <i className="fa-solid fa-spinner fa-spin text-emerald-700 text-lg" />

                            <p className="mt-3 text-xs text-gray-500">
                                Loading pending payments...
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                            <i className="fa-solid fa-circle-exclamation text-red-500" />

                            <p className="mt-2 text-xs font-medium text-red-700">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadPayments}
                                className="mt-3 text-xs font-bold text-red-700 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && payments.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                                <i className="fa-solid fa-check text-emerald-600" />
                            </div>

                            <h3 className="mt-3 text-sm font-bold text-gray-900">
                                No pending payments
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                All customer payments are currently up to date.
                            </p>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        payments.map((payment) => (
                            <div
                                key={payment.payment_id}
                                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                            >
                                {/* Customer + status */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-heading font-bold text-sm text-gray-900 truncate">
                                            {payment.user_name}
                                        </h3>

                                        <p className="mt-0.5 text-[11px] text-gray-500">
                                            {formatMealType(payment.meal_type)}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700">
                                        PENDING
                                    </span>
                                </div>

                                {/* Amount */}
                                <div className="mt-4 rounded-xl bg-[#FFF8EE] border border-[#FFEDD5] p-3 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] text-[#9A3412]">
                                            Payment amount
                                        </span>

                                        <span className="text-xs font-semibold text-[#7C2D12]">
                                            {formatMealType(payment.meal_type)}
                                        </span>
                                    </div>

                                    <span className="font-heading font-extrabold text-xl text-[#111827]">
                                        ₹
                                        {Number(payment.amount).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>

                                {/* Payment details */}
                                <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-2.5">
                                    <div className="flex justify-between gap-3 text-xs">
                                        <span className="text-gray-500">
                                            UTR / Reference
                                        </span>

                                        <span className="font-mono font-bold text-gray-900 break-all text-right">
                                            {payment.utr}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3 text-xs">
                                        <span className="text-gray-500">
                                            Submitted
                                        </span>

                                        <span className="font-medium text-gray-900">
                                            {formatDateTime(
                                                payment.created_at
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Proof */}
                                {payment.proof_url && (
                                    <a
                                        href={payment.proof_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 w-full min-h-[42px] rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <i className="fa-regular fa-image" />
                                        View payment proof
                                    </a>
                                )}

                                {/* Actions */}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        disabled={processingPaymentId === payment.payment_id}
                                        onClick={() =>
                                            handlePaymentAction(payment.payment_id, "reject")
                                        }
                                        className="min-h-[46px] rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition"
                                    >
                                        <i className="fa-solid fa-xmark mr-1.5" />
                                        {processingPaymentId === payment.payment_id
                                            ? "Processing..."
                                            : "Reject"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={processingPaymentId === payment.payment_id}
                                        onClick={() =>
                                            handlePaymentAction(payment.payment_id, "approve")
                                        }
                                        className="min-h-[46px] rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
                                    >
                                        <i className="fa-solid fa-check mr-1.5" />
                                        {processingPaymentId === payment.payment_id
                                            ? "Processing..."
                                            : "Approve"}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};