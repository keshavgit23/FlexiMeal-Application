import React from 'react';
import { SetupChecklistItem } from './SetupCheckListItem';
import { SectionHeader } from '../shared/SectionHeader';
import type { MessOwnerData } from '../../../types/messOnboarding';

export interface SetupChecklistProps {
    messData: MessOwnerData;
    onOpenMonthlyPrice: () => void;
    onOpenProfile: () => void;
    onOpenPhotos?: () => void;
}

export const SetupChecklist: React.FC<SetupChecklistProps> = ({
    messData,
    onOpenMonthlyPrice,
    onOpenProfile,
    onOpenPhotos,
}) => {
    //   const isPriceSet = messData.monthlyPrice !== null && messData.monthlyPrice > 0;
    //   const isProfileSet =
    //     messData.description.trim().length > 0 &&
    //     messData.mealAvailability.length > 0;
    const isPriceSet =
        messData.monthlyPrice !== null && messData.monthlyPrice > 0;

    const hasMealOffering =
        messData.offersBreakfast ||
        messData.offersLunch ||
        messData.offersDinner;

    const isProfileSet =
        Boolean(messData.description?.trim()) &&
        hasMealOffering;

    const mealCount = [
        messData.offersBreakfast,
        messData.offersLunch,
        messData.offersDinner,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* REQUIRED TO PUBLISH */}
            <section aria-labelledby="required-section-heading">
                <SectionHeader
                    title="Required to Publish"
                    subtitle="Mandatory steps to activate your student listing"
                />

                <div className="space-y-3">
                    {/* Row 1: Monthly Price */}
                    <SetupChecklistItem
                        icon="fa-solid fa-indian-rupee-sign"
                        title="Monthly Price"
                        subtitle={
                            isPriceSet
                                ? `Active base rate: ₹${messData.monthlyPrice?.toLocaleString('en-IN')}/mo`
                                : 'Set your standard monthly mess price'
                        }
                        status={isPriceSet ? 'COMPLETED' : 'PENDING'}
                        valuePreview={
                            isPriceSet
                                ? `₹${messData.monthlyPrice?.toLocaleString('en-IN')}`
                                : undefined
                        }
                        onClick={onOpenMonthlyPrice}
                    />

                    {/* Row 2: Mess Profile & Meals */}
                    <SetupChecklistItem
                        icon="fa-solid fa-utensils"
                        title="Mess Profile & Meals"
                        subtitle={
                            isProfileSet
                                ? `${messData.foodType === 'PURE_VEG' ? 'Pure Veg' : 'Veg & Non-Veg'} • ${mealCount} meals configured`
                                : 'Add information students need to know'
                        }
                        status={isProfileSet ? 'COMPLETED' : 'PENDING'}
                        valuePreview={
                            isProfileSet
                                ? messData.foodType === 'PURE_VEG'
                                    ? 'Pure Veg'
                                    : 'Veg/Non-Veg'
                                : undefined
                        }
                        onClick={onOpenProfile}
                    />
                </div>
            </section>

            {/* OPTIONAL SECTION */}
            <section aria-labelledby="optional-section-heading">
                <SectionHeader
                    title="Optional"
                    subtitle="Enhance student trust (does not block publishing)"
                />

                <div className="space-y-3">
                    {/* <SetupChecklistItem
            icon="fa-solid fa-image"
            title="Mess Photos"
            subtitle={
              messData.photos.length > 0
                ? `${messData.photos.length} mess photo${messData.photos.length > 1 ? 's' : ''} uploaded`
                : 'Add photos to help students recognize your mess'
            }
            status="OPTIONAL"
            valuePreview={
              messData.photos.length > 0
                ? `${messData.photos.length} photos`
                : undefined
            }
            onClick={onOpenPhotos || onOpenProfile}
          /> */}
                    <SetupChecklistItem
                        icon="fa-solid fa-image"
                        title="Mess Photos"
                        subtitle="Add photos to help students recognize your mess"
                        status="OPTIONAL"
                        onClick={onOpenPhotos || onOpenProfile}
                    />
                </div>
            </section>

            {/* COMPLETED IN ONBOARDING */}
            <section aria-labelledby="onboarding-section-heading">
                <SectionHeader
                    title="Completed in Onboarding"
                    subtitle="Verified information from account creation"
                />

                <div className="space-y-2.5">
                    <SetupChecklistItem
                        icon="fa-solid fa-store"
                        title="Mess Name"
                        subtitle={messData.name}
                        status="COMPLETED"
                        isReadOnly
                    />

                    <SetupChecklistItem
                        icon="fa-solid fa-location-dot"
                        title="Location / Address"
                        subtitle={`${messData.address}, ${messData.state}`}
                        status="COMPLETED"
                        isReadOnly
                    />
                </div>
            </section>
        </div>
    );
};
