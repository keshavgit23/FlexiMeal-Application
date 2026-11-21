import React, { useState, useId } from 'react';

export type TargetGender = 'MALE' | 'FEMALE' | 'ALL';

export type PlanMealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface CreateMessPlanPayload {
  plan_name: string;
  target_gender: TargetGender;
  price: number;
  meal_types: PlanMealType[];
}

export interface MessPlanScreenProps {
  onSave: (payload: CreateMessPlanPayload) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  plan_name?: string;
  target_gender?: string;
  meal_types?: string;
  price?: string;
}

interface AudienceOption {
  value: TargetGender;
  label: string;
  sublabel: string;
  iconClass: string;
}

interface MealOption {
  value: PlanMealType;
  label: string;
  sublabel: string;
  iconClass: string;
}

/**
 * Temporary layout references representing example plan packages.
 * These are strictly UI helper cues to guide the mess owner.
 */
const EXAMPLE_PLANS_HINT = [
  { name: 'Boys Monthly', audience: 'MALE', meals: 'Lunch + Dinner', price: '₹2,400' },
  { name: 'Girls Special', audience: 'FEMALE', meals: 'Lunch + Dinner', price: '₹2,000' },
  { name: 'Complete Monthly', audience: 'ALL', meals: 'Breakfast + Lunch + Dinner', price: '₹3,000' },
];

const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    value: 'MALE',
    label: 'Male',
    sublabel: 'Boys only',
    iconClass: 'fa-solid fa-mars',
  },
  {
    value: 'FEMALE',
    label: 'Female',
    sublabel: 'Girls only',
    iconClass: 'fa-solid fa-venus',
  },
  {
    value: 'ALL',
    label: 'Everyone',
    sublabel: 'All consumers',
    iconClass: 'fa-solid fa-users',
  },
];

const MEAL_OPTIONS: MealOption[] = [
  {
    value: 'BREAKFAST',
    label: 'Breakfast',
    sublabel: 'Morning meal',
    iconClass: 'fa-solid fa-mug-saucer',
  },
  {
    value: 'LUNCH',
    label: 'Lunch',
    sublabel: 'Afternoon meal',
    iconClass: 'fa-solid fa-sun',
  },
  {
    value: 'DINNER',
    label: 'Dinner',
    sublabel: 'Night meal',
    iconClass: 'fa-solid fa-moon',
  },
];

export const MessPlanScreen: React.FC<MessPlanScreenProps> = ({
  onSave,
  onBack,
  isSubmitting = false,
}) => {
  const planNameInputId = useId();
  const priceInputId = useId();

  const [planName, setPlanName] = useState<string>('');
  const [targetGender, setTargetGender] = useState<TargetGender | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<PlanMealType[]>(['LUNCH', 'DINNER']);
  const [priceInput, setPriceInput] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const toggleMeal = (meal: PlanMealType) => {
    setSelectedMeals((prev) => {
      const exists = prev.includes(meal);
      const updated = exists ? prev.filter((m) => m !== meal) : [...prev, meal];
      if (touched.meal_types) {
        if (updated.length === 0) {
          setErrors((e) => ({ ...e, meal_types: 'Select at least one meal for this plan' }));
        } else {
          setErrors((e) => ({ ...e, meal_types: undefined }));
        }
      }
      return updated;
    });
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!planName.trim()) {
      nextErrors.plan_name = 'Plan name is required';
    } else if (planName.trim().length < 3) {
      nextErrors.plan_name = 'Plan name must be at least 3 characters';
    }

    if (!targetGender) {
      nextErrors.target_gender = 'Please select a target audience';
    }

    if (selectedMeals.length === 0) {
      nextErrors.meal_types = 'Please select at least one included meal';
    }

    const parsedPrice = parseFloat(priceInput.trim());
    if (!priceInput.trim()) {
      nextErrors.price = 'Monthly subscription price is required';
    } else if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = 'Please enter a valid monthly price greater than ₹0';
    } else if (parsedPrice > 50000) {
      nextErrors.price = 'Please enter a realistic monthly price (max ₹50,000)';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      plan_name: true,
      target_gender: true,
      meal_types: true,
      price: true,
    });

    if (!validate() || !targetGender) {
      return;
    }

    const payload: CreateMessPlanPayload = {
      plan_name: planName.trim(),
      target_gender: targetGender,
      meal_types: selectedMeals,
      price: Math.round(parseFloat(priceInput.trim())),
    };

    onSave(payload);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background, #FFFDF9)',
        color: 'var(--color-text-primary, #111827)',
        fontFamily: 'var(--font-family-body, "Plus Jakarta Sans", sans-serif)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: 'var(--color-surface, #FFFFFF)',
          borderBottom: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
          boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--layout-container-max-width, 1280px)',
            margin: '0 auto',
            padding: 'var(--space-3, 0.75rem) var(--space-4, 1rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3, 0.75rem)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3, 0.75rem)' }}>
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-full, 9999px)',
                border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                color: 'var(--color-text-primary, #111827)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            </button>
            <div>
              <div
                style={{
                  fontSize: 'var(--font-size-label, 0.75rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  color: 'var(--color-role-owner-primary, #047857)',
                }}
              >
                Subscription Plans
              </div>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-family-heading, "Outfit", sans-serif)',
                  fontSize: 'var(--font-size-heading-5, 1.25rem)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  lineHeight: 'var(--line-height-tight, 1.1)',
                }}
              >
                Create a Meal Plan
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '720px',
          margin: '0 auto',
          padding: 'var(--space-4, 1rem) var(--space-4, 1rem) var(--space-24, 6rem)',
        }}
      >
        {/* Intro banner */}
        <div
          style={{
            marginBottom: 'var(--space-5, 1.25rem)',
            padding: 'var(--space-4, 1rem)',
            backgroundColor: 'var(--color-surface, #FFFFFF)',
            borderRadius: 'var(--radius-xl, 0.75rem)',
            border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
            boxShadow: 'var(--shadow-resting, 0 4px 20px rgba(0, 0, 0, 0.05))',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-3, 0.75rem)', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: 'var(--radius-lg, 0.5rem)',
                backgroundColor: 'var(--primitive-emerald-100, #D1FAE5)',
                color: 'var(--color-role-owner-primary, #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i className="fa-solid fa-utensils" aria-hidden="true" />
            </div>
            <div>
              <h2
                style={{
                  margin: '0 0 var(--space-1, 0.25rem) 0',
                  fontSize: 'var(--font-size-body-base, 1rem)',
                  fontWeight: 'var(--font-weight-semibold, 600)',
                }}
              >
                Flexible User Packages
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-body-sm, 0.875rem)',
                  color: 'var(--color-text-secondary, #6B7280)',
                  lineHeight: 'var(--line-height-relaxed, 1.6)',
                }}
              >
                Define monthly packages combining specific meals (e.g. Lunch + Dinner) tailored to
                boys, girls, or all subscribers with a single recurring monthly price.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Configuration Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5, 1.25rem)' }}>
            {/* Section 1: Plan Name */}
            <div
              style={{
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                borderRadius: 'var(--radius-xl, 0.75rem)',
                padding: 'var(--space-5, 1.25rem)',
                border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
              }}
            >
              <label
                htmlFor={planNameInputId}
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-body-sm, 0.875rem)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  color: 'var(--color-text-primary, #111827)',
                  marginBottom: 'var(--space-1, 0.25rem)',
                }}
              >
                Plan Name <span style={{ color: 'var(--primitive-red-600, #DC2626)' }}>*</span>
              </label>
              <p
                style={{
                  margin: '0 0 var(--space-3, 0.75rem) 0',
                  fontSize: 'var(--font-size-label, 0.75rem)',
                  color: 'var(--color-text-secondary, #6B7280)',
                }}
              >
                A recognizable name displayed to students browsing your mess.
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  id={planNameInputId}
                  type="text"
                  value={planName}
                  onChange={(e) => {
                    setPlanName(e.target.value);
                    if (errors.plan_name) {
                      setErrors((prev) => ({ ...prev, plan_name: undefined }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, plan_name: true }));
                    if (!planName.trim()) {
                      setErrors((prev) => ({ ...prev, plan_name: 'Plan name is required' }));
                    }
                  }}
                  placeholder="e.g. Boys Monthly"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3, 0.75rem) var(--space-3-5, 0.875rem)',
                    borderRadius: 'var(--radius-lg, 0.5rem)',
                    border: `var(--border-width-default, 1px) solid ${errors.plan_name
                        ? 'var(--primitive-red-600, #DC2626)'
                        : 'var(--color-border, #E5E7EB)'
                      }`,
                    fontSize: 'var(--font-size-body-base, 1rem)',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--primitive-white, #FFFFFF)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                />
              </div>

              {errors.plan_name && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1-5, 0.375rem)',
                    marginTop: 'var(--space-2, 0.5rem)',
                    color: 'var(--primitive-red-600, #DC2626)',
                    fontSize: 'var(--font-size-label, 0.75rem)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                  <span>{errors.plan_name}</span>
                </div>
              )}
            </div>

            {/* Section 2: Target Audience */}
            <fieldset
              style={{
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                borderRadius: 'var(--radius-xl, 0.75rem)',
                padding: 'var(--space-5, 1.25rem)',
                border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
                margin: 0,
              }}
            >
              <legend
                style={{
                  fontSize: 'var(--font-size-body-sm, 0.875rem)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  color: 'var(--color-text-primary, #111827)',
                  padding: 0,
                  marginBottom: 'var(--space-1, 0.25rem)',
                }}
              >
                Target Audience <span style={{ color: 'var(--primitive-red-600, #DC2626)' }}>*</span>
              </legend>
              <p
                style={{
                  margin: '0 0 var(--space-3, 0.75rem) 0',
                  fontSize: 'var(--font-size-label, 0.75rem)',
                  color: 'var(--color-text-secondary, #6B7280)',
                }}
              >
                Specify who this subscription plan is primarily intended for.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                  gap: 'var(--space-2-5, 0.625rem)',
                }}
              >
                {AUDIENCE_OPTIONS.map((opt) => {
                  const isSelected = targetGender === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => {
                        setTargetGender(opt.value);
                        setTouched((t) => ({ ...t, target_gender: true }));
                        setErrors((e) => ({ ...e, target_gender: undefined }));
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--space-3-5, 0.875rem) var(--space-2, 0.5rem)',
                        borderRadius: 'var(--radius-lg, 0.5rem)',
                        border: `var(--border-width-emphasis, 2px) solid ${isSelected
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'var(--color-border, #E5E7EB)'
                          }`,
                        backgroundColor: isSelected
                          ? 'var(--primitive-emerald-50, #ECFDF5)'
                          : 'var(--primitive-white, #FFFFFF)',
                        color: isSelected
                          ? 'var(--color-role-owner-primary, #047857)'
                          : 'var(--color-text-primary, #111827)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      <i
                        className={opt.iconClass}
                        style={{
                          fontSize: '1.25rem',
                          marginBottom: 'var(--space-1-5, 0.375rem)',
                          color: isSelected
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'var(--primitive-gray-400, #9CA3AF)',
                        }}
                        aria-hidden="true"
                      />
                      <span
                        style={{
                          fontSize: 'var(--font-size-body-sm, 0.875rem)',
                          fontWeight: 'var(--font-weight-bold, 700)',
                        }}
                      >
                        {opt.label}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption, 0.6875rem)',
                          color: isSelected
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'var(--color-text-secondary, #6B7280)',
                          marginTop: 'var(--space-0-5, 0.125rem)',
                        }}
                      >
                        {opt.sublabel}
                      </span>
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.375rem',
                            right: '0.375rem',
                            color: 'var(--color-role-owner-primary, #047857)',
                            fontSize: '0.75rem',
                          }}
                        >
                          <i className="fa-solid fa-circle-check" aria-hidden="true" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {errors.target_gender && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1-5, 0.375rem)',
                    marginTop: 'var(--space-2, 0.5rem)',
                    color: 'var(--primitive-red-600, #DC2626)',
                    fontSize: 'var(--font-size-label, 0.75rem)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                  <span>{errors.target_gender}</span>
                </div>
              )}
            </fieldset>

            {/* Section 3: Included Meals */}
            <fieldset
              style={{
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                borderRadius: 'var(--radius-xl, 0.75rem)',
                padding: 'var(--space-5, 1.25rem)',
                border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
                margin: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 'var(--space-1, 0.25rem)',
                }}
              >
                <legend
                  style={{
                    fontSize: 'var(--font-size-body-sm, 0.875rem)',
                    fontWeight: 'var(--font-weight-bold, 700)',
                    color: 'var(--color-text-primary, #111827)',
                    padding: 0,
                  }}
                >
                  Included Meals <span style={{ color: 'var(--primitive-red-600, #DC2626)' }}>*</span>
                </legend>
                <span
                  style={{
                    fontSize: 'var(--font-size-caption, 0.6875rem)',
                    color: 'var(--color-text-secondary, #6B7280)',
                  }}
                >
                  Multi-select
                </span>
              </div>
              <p
                style={{
                  margin: '0 0 var(--space-3, 0.75rem) 0',
                  fontSize: 'var(--font-size-label, 0.75rem)',
                  color: 'var(--color-text-secondary, #6B7280)',
                }}
              >
                Choose which daily meals are covered under this monthly package.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: 'var(--space-2-5, 0.625rem)',
                }}
              >
                {MEAL_OPTIONS.map((meal) => {
                  const isChecked = selectedMeals.includes(meal.value);
                  return (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      key={meal.value}
                      onClick={() => toggleMeal(meal.value)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--space-3-5, 0.875rem) var(--space-2, 0.5rem)',
                        borderRadius: 'var(--radius-lg, 0.5rem)',
                        border: `var(--border-width-emphasis, 2px) solid ${isChecked
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'var(--color-border, #E5E7EB)'
                          }`,
                        backgroundColor: isChecked
                          ? 'var(--primitive-emerald-50, #ECFDF5)'
                          : 'var(--primitive-white, #FFFFFF)',
                        color: isChecked
                          ? 'var(--color-role-owner-primary, #047857)'
                          : 'var(--color-text-primary, #111827)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      <i
                        className={meal.iconClass}
                        style={{
                          fontSize: '1.25rem',
                          marginBottom: 'var(--space-1-5, 0.375rem)',
                          color: isChecked
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'var(--primitive-gray-400, #9CA3AF)',
                        }}
                        aria-hidden="true"
                      />
                      <span
                        style={{
                          fontSize: 'var(--font-size-body-sm, 0.875rem)',
                          fontWeight: 'var(--font-weight-bold, 700)',
                        }}
                      >
                        {meal.label}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption, 0.6875rem)',
                          color: isChecked
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'var(--color-text-secondary, #6B7280)',
                          marginTop: 'var(--space-0-5, 0.125rem)',
                        }}
                      >
                        {meal.sublabel}
                      </span>
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.375rem',
                          right: '0.375rem',
                          width: '1rem',
                          height: '1rem',
                          borderRadius: 'var(--radius-md, 0.375rem)',
                          border: `1px solid ${isChecked
                              ? 'var(--color-role-owner-primary, #047857)'
                              : 'var(--primitive-gray-300, #D1D5DB)'
                            }`,
                          backgroundColor: isChecked
                            ? 'var(--color-role-owner-primary, #047857)'
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primitive-white, #FFFFFF)',
                          fontSize: '0.625rem',
                        }}
                      >
                        {isChecked && <i className="fa-solid fa-check" aria-hidden="true" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.meal_types && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1-5, 0.375rem)',
                    marginTop: 'var(--space-2, 0.5rem)',
                    color: 'var(--primitive-red-600, #DC2626)',
                    fontSize: 'var(--font-size-label, 0.75rem)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                  <span>{errors.meal_types}</span>
                </div>
              )}
            </fieldset>

            {/* Section 4: Monthly Price */}
            <div
              style={{
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                borderRadius: 'var(--radius-xl, 0.75rem)',
                padding: 'var(--space-5, 1.25rem)',
                border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
              }}
            >
              <label
                htmlFor={priceInputId}
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-body-sm, 0.875rem)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  color: 'var(--color-text-primary, #111827)',
                  marginBottom: 'var(--space-1, 0.25rem)',
                }}
              >
                Monthly Subscription Price <span style={{ color: 'var(--primitive-red-600, #DC2626)' }}>*</span>
              </label>
              <p
                style={{
                  margin: '0 0 var(--space-3, 0.75rem) 0',
                  fontSize: 'var(--font-size-label, 0.75rem)',
                  color: 'var(--color-text-secondary, #6B7280)',
                }}
              >
                Total recurring monthly price for this complete package (not per individual meal).
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-lg, 0.5rem)',
                  border: `var(--border-width-default, 1px) solid ${errors.price
                      ? 'var(--primitive-red-600, #DC2626)'
                      : 'var(--color-border, #E5E7EB)'
                    }`,
                  backgroundColor: 'var(--primitive-white, #FFFFFF)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: 'var(--space-3, 0.75rem) var(--space-4, 1rem)',
                    backgroundColor: 'var(--primitive-gray-50, #F9FAFB)',
                    borderRight: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                    fontSize: 'var(--font-size-heading-5, 1.25rem)',
                    fontWeight: 'var(--font-weight-bold, 700)',
                    color: 'var(--color-text-primary, #111827)',
                  }}
                >
                  ₹
                </div>
                <input
                  id={priceInputId}
                  type="text"
                  inputMode="numeric"
                  value={priceInput}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only whole numbers
                    if (/^\d*$/.test(value)) {
                      setPriceInput(value);

                      if (errors.price) {
                        setErrors((prev) => ({
                          ...prev,
                          price: undefined,
                        }));
                      }
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, price: true }));
                    const val = parseFloat(priceInput.trim());
                    if (!priceInput.trim() || Number.isNaN(val) || val <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        price: 'Please enter a valid monthly price greater than ₹0',
                      }));
                    }
                  }}
                  placeholder="e.g. 2400"
                  style={{
                    flex: 1,
                    padding: 'var(--space-3, 0.75rem) var(--space-3-5, 0.875rem)',
                    border: 'none',
                    outline: 'none',
                    fontSize: 'var(--font-size-heading-5, 1.25rem)',
                    fontWeight: 'var(--font-weight-semibold, 600)',
                    fontFamily: 'inherit',
                    color: 'var(--color-text-primary, #111827)',
                  }}
                />
                <span
                  style={{
                    paddingRight: 'var(--space-3-5, 0.875rem)',
                    fontSize: 'var(--font-size-label, 0.75rem)',
                    color: 'var(--color-text-secondary, #6B7280)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                  }}
                >
                  / month
                </span>
              </div>

              {errors.price && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1-5, 0.375rem)',
                    marginTop: 'var(--space-2, 0.5rem)',
                    color: 'var(--primitive-red-600, #DC2626)',
                    fontSize: 'var(--font-size-label, 0.75rem)',
                    fontWeight: 'var(--font-weight-medium, 500)',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                  <span>{errors.price}</span>
                </div>
              )}
            </div>

            {/* Example Plans Reference Hint Card */}
            <div
              style={{
                padding: 'var(--space-3-5, 0.875rem) var(--space-4, 1rem)',
                backgroundColor: 'var(--color-background-alt, #FFF8EE)',
                borderRadius: 'var(--radius-lg, 0.5rem)',
                border: 'var(--border-width-default, 1px) dashed var(--primitive-amber-300, #FCD34D)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2, 0.5rem)',
                  fontSize: 'var(--font-size-label, 0.75rem)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  color: 'var(--primitive-gray-800, #1F2937)',
                  marginBottom: 'var(--space-2, 0.5rem)',
                }}
              >
                <i className="fa-solid fa-lightbulb" style={{ color: 'var(--primitive-amber-500, #F59E0B)' }} aria-hidden="true" />
                <span>Common examples used by other messes:</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1-5, 0.375rem)',
                  fontSize: 'var(--font-size-caption, 0.6875rem)',
                  color: 'var(--primitive-gray-600, #4B5563)',
                }}
              >
                {EXAMPLE_PLANS_HINT.map((ex) => (
                  <div
                    key={ex.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      <strong>{ex.name}</strong> ({ex.meals} = {ex.audience})
                    </span>
                    <span style={{ fontWeight: 'var(--font-weight-semibold, 600)' }}>
                      {ex.price}/mo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Mobile-First Action Bar */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'var(--color-surface, #FFFFFF)',
              borderTop: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
              padding: 'var(--space-3, 0.75rem) var(--space-4, 1rem)',
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
              zIndex: 30,
            }}
          >
            <div
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                display: 'flex',
                gap: 'var(--space-3, 0.75rem)',
              }}
            >
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: 'var(--space-3-5, 0.875rem) var(--space-4, 1rem)',
                  borderRadius: 'var(--radius-lg, 0.5rem)',
                  border: 'var(--border-width-default, 1px) solid var(--color-border, #E5E7EB)',
                  backgroundColor: 'var(--primitive-white, #FFFFFF)',
                  color: 'var(--color-text-primary, #111827)',
                  fontSize: 'var(--font-size-body-base, 1rem)',
                  fontWeight: 'var(--font-weight-semibold, 600)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background-color 0.15s ease',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2, 0.5rem)',
                  padding: 'var(--space-3-5, 0.875rem) var(--space-4, 1rem)',
                  borderRadius: 'var(--radius-lg, 0.5rem)',
                  border: 'none',
                  backgroundColor: isSubmitting
                    ? 'var(--primitive-emerald-400, #34D399)'
                    : 'var(--color-role-owner-primary, #047857)',
                  color: 'var(--primitive-white, #FFFFFF)',
                  fontSize: 'var(--font-size-body-base, 1rem)',
                  fontWeight: 'var(--font-weight-bold, 700)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                    <span>Saving Plan...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                    <span>Create Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default MessPlanScreen;
