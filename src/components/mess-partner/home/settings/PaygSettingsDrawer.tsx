
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { getPaygSettings } from "../../../../apis/mess-partner/getPaygSettings.api";
import { updatePaygSettings } from "../../../../apis/mess-partner/updatePaygSettings.api";
import type { PaygPrices } from "../../../../apis/mess-partner/getPaygSettings.api";
import type { UpdatePaygPrices } from "../../../../apis/mess-partner/updatePaygSettings.api";

interface PaygSettingsDrawerProps {
    onClose: () => void;
    showToast: (
        message: string,
        type: "success" | "error"
    ) => void;
}

const MEALS = [
    { key: "BREAKFAST", label: "Breakfast" },
    { key: "LUNCH", label: "Lunch" },
    { key: "DINNER", label: "Dinner" },
] as const;

const PaygSettingsDrawer = ({
    onClose,
    showToast,
}: PaygSettingsDrawerProps) => {
    const { getToken } = useAuth();

    const [prices, setPrices] = useState<PaygPrices>({
        BREAKFAST: null,
        LUNCH: null,
        DINNER: null,
    });

    const [draftPrices, setDraftPrices] = useState({
        BREAKFAST: "",
        LUNCH: "",
        DINNER: "",
    });

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

                const result = await getPaygSettings(token);

                if (!result.success || !result.data) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch PAYG settings"
                    );
                }

                if (cancelled) return;

                const savedPrices = result.data.prices;

                setPrices(savedPrices);
                setDraftPrices({
                    BREAKFAST: savedPrices.BREAKFAST?.toString() ?? "",
                    LUNCH: savedPrices.LUNCH?.toString() ?? "",
                    DINNER: savedPrices.DINNER?.toString() ?? "",
                });
            } catch (error) {
                if (cancelled) return;

                showToast(
                    error instanceof Error
                        ? error.message
                        : "Failed to load PAYG settings",
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
        const changedPrices: UpdatePaygPrices = {};

        for (const meal of MEALS) {
            const key = meal.key;
            const value = draftPrices[key].trim();
            const originalPrice = prices[key];

            // Empty fields are left unchanged.
            if (value === "") continue;

            const parsedPrice = Number(value);

            if (
                !Number.isFinite(parsedPrice) ||
                parsedPrice <= 0 ||
                !/^\d+(\.\d{1,2})?$/.test(value)
            ) {
                showToast(
                    `Enter a valid ${meal.label.toLowerCase()} price`,
                    "error"
                );
                return;
            }

            if (parsedPrice !== originalPrice) {
                changedPrices[key] = parsedPrice;
            }
        }

        if (Object.keys(changedPrices).length === 0) {
            showToast("No price changes to save", "error");
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

            const result = await updatePaygSettings(
                token,
                changedPrices
            );

            if (!result.success || !result.data) {
                throw new Error(
                    result.message ||
                    "Failed to update PAYG settings"
                );
            }

            const savedPrices = result.data.prices;

            setPrices(savedPrices);
            setDraftPrices({
                BREAKFAST: savedPrices.BREAKFAST?.toString() ?? "",
                LUNCH: savedPrices.LUNCH?.toString() ?? "",
                DINNER: savedPrices.DINNER?.toString() ?? "",
            });

            showToast(
                "PAYG prices updated successfully",
                "success"
            );
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Failed to update PAYG settings",
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
                            PAYG Meal Prices
                        </h2>
                        <p className="text-xs text-gray-500">
                            Set prices for individual meals.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close PAYG settings"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-10 text-center text-sm text-gray-500">
                        Loading saved prices...
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {MEALS.map((meal) => (
                                <div key={meal.key}>
                                    <label
                                        htmlFor={`payg-${meal.key}`}
                                        className="mb-1.5 block text-sm font-bold text-gray-800"
                                    >
                                        {meal.label}
                                    </label>

                                    <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-emerald-500">
                                        <span className="pl-3 text-gray-500">
                                            ₹
                                        </span>

                                        <input
                                            id={`payg-${meal.key}`}
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            inputMode="decimal"
                                            placeholder="Not configured"
                                            value={draftPrices[meal.key]}
                                            onChange={(event) =>
                                                setDraftPrices((previous) => ({
                                                    ...previous,
                                                    [meal.key]: event.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl bg-transparent px-3 py-3 text-sm outline-none"
                                        />
                                    </div>

                                    <p className="mt-1 text-[11px] text-gray-500">
                                        {prices[meal.key] == null
                                            ? "No saved price"
                                            : `Current price: ₹${prices[meal.key]}`}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Leave a field empty to keep its saved price
                            unchanged. A blank, unconfigured price stays
                            unconfigured.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isLoading || isSaving}
                                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Prices"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaygSettingsDrawer;
