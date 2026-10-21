/**
 * Client-side validation utility for Add Meal operational flow.
 * Pure TypeScript functions with no UI or framework dependencies.
 */

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface MealFormData {
  mealType: MealType;
  mealDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  cutoffTime: string; // HH:mm
  payAsYouGo: boolean;
  menuItems: string[];
}

export interface MealFormErrors {
  mealType?: string;
  mealDate?: string;
  startTime?: string;
  endTime?: string;
  cutoffTime?: string;
  menuItems?: string;
  menuItemErrors?: Record<number, string>; // Individual index errors
}

export interface MealValidationResult {
  isValid: boolean;
  errors: MealFormErrors;
}

/**
 * Converts HH:mm time string into minutes since midnight.
 * Returns null if format is invalid.
 */
export function timeToMinutes(timeStr: string): number | null {
  if (!timeStr || !timeStr.trim()) return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

/**
 * Validates the Add Meal form data according to operational mess business rules.
 */
export function validateMealForm(data: MealFormData): MealValidationResult {
  const errors: MealFormErrors = {};
  const menuItemErrors: Record<number, string> = {};

  // 1. Meal type is selected
  if (!data.mealType || !['BREAKFAST', 'LUNCH', 'DINNER'].includes(data.mealType)) {
    errors.mealType = 'Please select a meal type (Breakfast, Lunch, or Dinner)';
  }

  // 2. Meal date is present
  if (!data.mealDate || !data.mealDate.trim()) {
    errors.mealDate = 'Meal date is required';
  }

  // 3. Start time is present
  const startMin = timeToMinutes(data.startTime);
  if (!data.startTime || !data.startTime.trim()) {
    errors.startTime = 'Start time is required';
  }

  // 4. End time is present
  const endMin = timeToMinutes(data.endTime);
  if (!data.endTime || !data.endTime.trim()) {
    errors.endTime = 'End time is required';
  }

  // 5. Booking cutoff time is present
  if (!data.cutoffTime || !data.cutoffTime.trim()) {
    errors.cutoffTime = 'Booking cutoff time is required';
  }

  // 6. End time is after start time
  if (startMin !== null && endMin !== null) {
    if (endMin <= startMin) {
      errors.endTime = 'End time must be after start time';
    }
  }

  // 7. Menu items validation
  if (!data.menuItems || data.menuItems.length === 0) {
    errors.menuItems = 'At least one menu item is required';
  } else {
    let hasEmpty = false;
    const seenMap = new Map<string, number>();
    const duplicateIndexes = new Set<number>();

    data.menuItems.forEach((item, index) => {
      const trimmed = item.trim();
      if (!trimmed) {
        hasEmpty = true;
        menuItemErrors[index] = 'Item name cannot be empty';
      } else {
        const normalized = trimmed.toLowerCase();
        if (seenMap.has(normalized)) {
          duplicateIndexes.add(index);
          const firstSeenIndex = seenMap.get(normalized)!;
          duplicateIndexes.add(firstSeenIndex);
        } else {
          seenMap.set(normalized, index);
        }
      }
    });

    if (hasEmpty) {
      errors.menuItems = 'Menu items cannot be empty';
    }

    if (duplicateIndexes.size > 0) {
      duplicateIndexes.forEach((idx) => {
        if (!menuItemErrors[idx]) {
          menuItemErrors[idx] = 'Duplicate menu item';
        }
      });
      errors.menuItems = errors.menuItems || 'Duplicate menu items are not allowed';
    }

    if (Object.keys(menuItemErrors).length > 0) {
      errors.menuItemErrors = menuItemErrors;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
  };
}
