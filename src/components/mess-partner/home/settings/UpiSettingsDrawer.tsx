
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { getUpiSettings } from "../../../../apis/mess-partner/getUpiSettings.api";
import { createUpiSettings } from "../../../../apis/mess-partner/createUpiSettings.api";

interface UpiSettingsDrawerProps {
    onClose: () => void;
    showToast: (
        message: string,
        type: "success" | "error"
    ) => void;
}

const UpiSettingsDrawer = ({
    onClose,
    showToast,
}: UpiSettingsDrawerProps) => {
    const { getToken } = useAuth();

    const [upiId, setUpiId] = useState("");
    const [savedUpiId, setSavedUpiId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadSettings = async () => {
            try {
                const token = await getToken();

                if (!token) {
                    throw new Error(
                        "Authentication token not available"
                    );
                }

                const result = await getUpiSettings(token);

                if (!result.success || !result.data) {
                    throw new Error(
                        result.message || "Failed to fetch UPI settings"
                    );
                }

                if (cancelled) return;

                const savedId = result.data.upi_id;

                setSavedUpiId(savedId);
                setUpiId(savedId ?? "");
            } catch (error) {
                if (cancelled) return;

                showToast(
                    error instanceof Error
                        ? error.message
                        : "Failed to load UPI settings",
                    "error"
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadSettings();

        return () => {
            cancelled = true;
        };
    }, [getToken, showToast]);

    const handleSave = async () => {
        const trimmedUpiId = upiId.trim();

        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

        if (!trimmedUpiId || !upiRegex.test(trimmedUpiId)) {
            showToast("Enter a valid UPI ID", "error");
            return;
        }

        if (trimmedUpiId.length > 255) {
            showToast("UPI ID is too long", "error");
            return;
        }

        if (trimmedUpiId === savedUpiId) {
            showToast("No changes to save", "error");
            return;
        }

        try {
            setIsSaving(true);

            const token = await getToken();

            if (!token) {
                throw new Error(
                    "Authentication token not available"
                );
            }

            const result = await createUpiSettings(token, {
                upi_id: trimmedUpiId,
            });

            if (!result.success || !result.data) {
                throw new Error(
                    result.message || "Failed to save UPI settings"
                );
            }

            setSavedUpiId(result.data.upi_id);
            setUpiId(result.data.upi_id);

            showToast(
                "UPI ID saved successfully",
                "success"
            );
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Failed to save UPI settings",
                "error"
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
            <div className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">
                            UPI Payment Details
                        </h2>
                        <p className="text-xs text-gray-500">
                            Set the UPI ID where students should pay.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close UPI settings"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-10 text-center text-sm text-gray-500">
                        Loading UPI settings...
                    </div>
                ) : (
                    <>
                        <div>
                            <label
                                htmlFor="owner-upi-id"
                                className="mb-1.5 block text-sm font-bold text-gray-800"
                            >
                                UPI ID
                            </label>

                            <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-emerald-500">
                                <span className="pl-3 text-gray-400">
                                    <i className="fa-solid fa-at" />
                                </span>

                                <input
                                    id="owner-upi-id"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="yourname@okaxis"
                                    value={upiId}
                                    onChange={(event) =>
                                        setUpiId(event.target.value)
                                    }
                                    className="w-full rounded-xl bg-transparent px-3 py-3 text-sm outline-none"
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Students will use this UPI ID to make
                                payments for your mess subscription.
                            </p>

                            {savedUpiId && (
                                <p className="mt-2 text-xs font-medium text-emerald-700">
                                    <i className="fa-solid fa-circle-check mr-1" />
                                    Current UPI ID: {savedUpiId}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk" />
                                    Save UPI Details
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpiSettingsDrawer;
