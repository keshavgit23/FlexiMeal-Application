import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
interface PaymentModalProps {
  profileId: number;
  messName: string;
  amount: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  defaultResponse: 'YES' | 'NO';
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  profileId,
  messName,
  amount,
  mealType,
  defaultResponse,
  onClose,
}) => {
  const { submitPayment, setShowSubscriptionHook } = useApp();
  const { showToast } = useToast();

  const upiId = 'rajeshwari.mess@okaxis';

  const [utrNumber, setUtrNumber] = useState('');
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUtr = utrNumber.trim();

    if (!/^\d{12,}$/.test(trimmedUtr)) {
      setErrorMsg('Please enter a valid UTR number with at least 12 digits.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await submitPayment(
        profileId,
        amount,
        mealType,
        defaultResponse,
        trimmedUtr,
        null
      );

      if (result.success) {
        showToast(
          'Payment submitted successfully. Your subscription is pending verification.',
          'success'
        );
        console.log('SETTING SUBSCRIPTION HOOK');
        setShowSubscriptionHook(true);
        setSubmitted(true);
        onClose();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Payment submission failed. Please try again.';
      showToast(message, 'error');
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0">
      <div
        className="w-full max-w-[430px] bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-4 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-[#D1D5DB] rounded-full mx-auto mb-3"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
          <div>
            <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wide">
              V1 Manual Payment
            </span>
            <h2 className="font-heading font-bold text-lg text-[#111827]">
              {submitted ? 'Payment Submitted' : 'Pay via UPI / QR'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto space-y-3.5 flex-1 pr-1">
          {submitted ? (
            /* SUBMITTED STATE: Verification Pending (Strict rule: NEVER display Paid immediately) */
            <div className="space-y-4 py-2">
              <div className="bg-[#FFF8EE] border border-[#FFEDD5] rounded-2xl p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xl mb-3">
                  <i className="fa-solid fa-hourglass-half animate-spin"></i>
                </div>
                <h3 className="font-heading font-bold text-base text-[#111827] mb-1">
                  Payment verification pending
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Your payment receipt of <strong>₹{amount.toLocaleString()}</strong> has been submitted to {messName}.
                </p>
                <div className="mt-3 pt-3 border-t border-[#FFEDD5] text-[11px] text-[#9A3412] font-medium">
                  Reference UTR: <span className="font-mono font-bold">{utrNumber}</span>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB] text-xs text-[#4B5563] space-y-2">
                <p className="font-semibold text-[#111827]">
                  What happens next?
                </p>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-[#16A34A] text-xs mt-0.5"></i>
                  <span>The mess operator checks their bank/UPI app for this UTR.</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-[#16A34A] text-xs mt-0.5"></i>
                  <span>Once verified (typically 1–2 hours), status updates to <strong>Verified (Paid)</strong>.</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full min-h-[48px] bg-[#111827] text-white text-xs font-bold rounded-xl active:scale-98 transition-transform"
              >
                Back to FlexiMeal
              </button>
            </div>
          ) : (
            /* PAYMENT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Amount Card */}
              <div className="bg-[#FFF8EE] rounded-xl p-3.5 border border-[#FFEDD5] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#9A3412] block">Payment of ₹{amount} for {mealType.toLowerCase()}</span>
                  <span className="font-heading font-bold text-sm text-[#7C2D12]">{messName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#9A3412] block">Amount to transfer</span>
                  <span className="font-heading font-extrabold text-xl text-[#DC2626]">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* UPI Details & QR code preview */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 space-y-3">
                <span className="text-xs font-bold text-[#111827] uppercase tracking-wide block">
                  Step 1: Transfer using UPI
                </span>

                <div className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div>
                    <span className="text-[10px] text-[#6B7280] block">Mess UPI ID</span>
                    <span className="font-mono font-bold text-xs text-[#111827]">{upiId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(upiId)}
                    className="text-xs font-semibold text-[#DC2626] hover:underline px-2 py-1"
                  >
                    <i className="fa-regular fa-copy mr-1"></i>Copy
                  </button>
                </div>

                {/* Simulated QR block */}
                <div className="flex items-center gap-3 p-2 bg-[#F3F4F6] rounded-lg">
                  <div className="w-14 h-14 bg-white border border-[#D1D5DB] rounded flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-qrcode text-2xl text-[#111827]"></i>
                  </div>
                  <div className="text-xs text-[#4B5563]">
                    <span className="font-semibold text-[#111827] block">Scan in GPay / PhonePe / Paytm</span>
                    <span className="text-[11px] text-[#6B7280]">Pay exactly ₹{amount} and copy 12-digit UTR</span>
                  </div>
                </div>
              </div>

              {/* UTR Reference Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111827] block">
                  Step 2: Enter 12-digit UTR / Reference No. <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 423891028471"
                  className="w-full min-h-[44px] px-3 bg-white border border-[#D1D5DB] rounded-xl text-xs font-mono focus:border-[#DC2626] focus:outline-none"
                  required
                />
                <span className="text-[10px] text-[#6B7280] block">
                  Found on your payment app receipt under 'UPI transaction ID' or 'UTR'.
                </span>
              </div>

              {/* Upload Proof (Simulated file input) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111827] block">
                  Step 3: Screenshot Proof (Optional)
                </label>
                <label className="w-full min-h-[44px] px-3 bg-white border border-dashed border-[#D1D5DB] rounded-xl text-xs flex items-center justify-between cursor-pointer hover:bg-[#F9FAFB]">
                  <span className="text-[#6B7280] truncate max-w-[240px]">
                    {proofFileName || 'Upload payment screenshot'}
                  </span>
                  <span className="text-[#DC2626] font-semibold shrink-0">
                    <i className="fa-solid fa-arrow-up-from-bracket mr-1"></i>Browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {errorMsg && (
                <div className="text-xs text-[#DC2626] font-medium bg-[#FEF2F2] p-2.5 rounded-lg border border-[#FEE2E2]">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl active:scale-98 transition-transform shadow-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                    <span>Submitting Payment...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                    <span>Submit Payment for Verification</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
