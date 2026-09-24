import React, { useState } from 'react';
import { QUICK_PRICE_SUGGESTIONS } from '../../../mockData';
import { InlineError } from '../shared/StateView';
import { StickyActionBar } from '../shared/StickyActionBar';

export interface MonthlyPriceScreenProps {
  initialPrice: number | null;
  onSave: (price: number) => void;
  onBack: () => void;
}

export const MonthlyPriceScreen: React.FC<MonthlyPriceScreenProps> = ({
  initialPrice,
  onSave,
  onBack,
}) => {
  const [priceStr, setPriceStr] = useState<string>(
    initialPrice ? String(initialPrice) : ''
  );
  const [error, setError] = useState<string>('');

  const validate = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setError('Please enter a monthly price.');
      return false;
    }
    const num = Number(trimmed);
    if (isNaN(num)) {
      setError('Enter a valid numeric monthly price.');
      return false;
    }
    if (num <= 0) {
      setError('Monthly price must be greater than ₹0.');
      return false;
    }
    if (num < 500) {
      setError('Monthly price cannot be less than ₹500.');
      return false;
    }
    if (num > 20000) {
      setError('Please check the price. Mess price is typically under ₹20,000/mo.');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPriceStr(val);
    if (error) {
      validate(val);
    }
  };

  const handleSelectSuggestion = (suggested: number) => {
    setPriceStr(String(suggested));
    setError('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validate(priceStr)) {
      onSave(Number(priceStr));
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* APP HEADER */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3.5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Setup Hub"
          className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition"
        >
          <i className="fa-solid fa-arrow-left text-base" />
        </button>
        <h1 className="text-base font-bold text-gray-900 font-heading">
          Set Monthly Price
        </h1>
      </header>

      {/* FORM CONTENT */}
      <main className="flex-1 p-5 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6 pt-2">
          {/* Label & Description */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading block mb-1">
              Base Subscription Rate
            </span>
            <h2 className="text-xl font-black text-gray-900 font-heading leading-tight">
              Monthly mess price
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Standard monthly fee for students subscribing to your daily meal
              plan.
            </p>
          </div>

          {/* PRICE HERO INPUT */}
          <div className="bg-stone-50/80 rounded-2xl p-6 border-2 border-dashed border-gray-200 focus-within:border-emerald-600 focus-within:bg-emerald-50/20 transition-all text-center">
            <label
              htmlFor="monthly-price-input"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2"
            >
              Amount in Rupees
            </label>

            <div className="flex items-center justify-center gap-2">
              <span
                className="text-3xl sm:text-4xl font-black text-gray-400 select-none font-heading"
                aria-hidden="true"
              >
                ₹
              </span>
              <input
                id="monthly-price-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="2,200"
                value={priceStr}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                className="w-44 text-3xl sm:text-4xl font-black text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-emerald-600 focus:outline-none text-center font-heading py-1 tracking-tight"
                aria-label="Monthly mess price in Indian Rupees"
                autoFocus
              />
            </div>

            <div className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              per month
            </div>

            {error && (
              <div className="mt-3 flex justify-center">
                <InlineError message={error} />
              </div>
            )}
          </div>

          {/* QUICK PRICE SUGGESTIONS */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading">
                Popular Rates in Pune
              </span>
              <span className="text-[11px] text-gray-400">Tap to select</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_PRICE_SUGGESTIONS.map((sug) => {
                const isSelected = priceStr === String(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm scale-[1.02]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95'
                    }`}
                  >
                    <span>₹{sug.toLocaleString('en-IN')}</span>
                    {isSelected && (
                      <i className="fa-solid fa-check text-[10px]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HELPER CALLOUT */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-blue-900">
            <i className="fa-solid fa-circle-info text-blue-600 text-sm mt-0.5 shrink-0" />
            <div className="leading-relaxed">
              <span className="font-bold">Student Visibility:</span> Students
              will see this rate on your public mess listing. You can adjust or
              offer customized coupons later in Settings.
            </div>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM ACTION */}
      <StickyActionBar>
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full min-h-[50px] px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm font-heading shadow-md transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-check text-xs" />
          <span>Save Monthly Price</span>
        </button>
      </StickyActionBar>
    </div>
  );
};
