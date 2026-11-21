
import type { CreateMessPlanPayload } from '../apis/mess-partner/MessPartnerSetup.api';

export interface MessPlanErrors {
  plan_name?: string;
  target_gender?: string;
  price?: string;
  meal_types?: string;
}

export interface MessPlanValidationResult {
  isValid: boolean;
  errors: MessPlanErrors;
}

const VALID_GENDERS = ['MALE', 'FEMALE', 'ALL'];

const VALID_MEALS = ['BREAKFAST', 'LUNCH', 'DINNER'];

/**
 * Validates custom mess plan data against business rules.
 */
export function validateMessPlan(
  data: CreateMessPlanPayload
): MessPlanValidationResult {
  const errors: MessPlanErrors = {};

  // 1. Plan name validation
  const name = data.plan_name?.trim() || '';

  if (!name) {
    errors.plan_name = 'Plan name is required';
  } else if (name.length < 3 || name.length > 50) {
    errors.plan_name = 'Plan name must be between 3 and 50 characters';
  }

  // 2. Target gender validation
  if (!VALID_GENDERS.includes(data.target_gender)) {
    errors.target_gender = 'Please select a valid target gender';
  }

  // 3. Monthly price validation
  const price = Number(data.price);

  if (
    data.price === null ||
    data.price === undefined ||
    String(data.price).trim() === '' ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    errors.price = 'Monthly price must be greater than zero';
  }

  // 4. Meal types validation
  if (!Array.isArray(data.meal_types) || data.meal_types.length === 0) {
    errors.meal_types = 'Please select at least one meal';
  } else {
    const hasInvalidMeal = data.meal_types.some(
      (meal) => !VALID_MEALS.includes(meal)
    );

    if (hasInvalidMeal) {
      errors.meal_types = 'Please select valid meal types';
    } else if (
      new Set(data.meal_types).size !== data.meal_types.length
    ) {
      errors.meal_types = 'Duplicate meal selections are not allowed';
    }
  }

  // 5. Plan name and target gender consistency
  const normalizedName = name.toLowerCase();

  const femalePattern = /\b(girls?|female|women|womens|ladies|lady)\b/;
  const malePattern = /\b(boys?|male|men)\b/;
  const allPattern = /\b(all genders?|unisex|co-ed)\b/;

  const isFemale = femalePattern.test(normalizedName);
  const isMale = malePattern.test(normalizedName);
  const isAll = allPattern.test(normalizedName);

  if (
    (isFemale && isMale) ||
    (isAll && (isFemale || isMale))
  ) {
    errors.plan_name = 'Plan name contains conflicting gender descriptions';
  } else if (isFemale && data.target_gender !== 'FEMALE') {
    errors.target_gender = 'This plan name indicates a female-only plan';
  } else if (isMale && data.target_gender !== 'MALE') {
    errors.target_gender = 'This plan name indicates a male-only plan';
  } else if (isAll && data.target_gender !== 'ALL') {
    errors.target_gender = 'This plan name indicates an all-gender plan';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
