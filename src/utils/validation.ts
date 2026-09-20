export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const required = (
  value: string,
  fieldName: string
): ValidationResult => {
  if (!value.trim()) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
};

export const phone = (value: string): ValidationResult => {
  if (!value.trim()) {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  if (!/^[6-9]\d{9}$/.test(value)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit phone number',
    };
  }

  return { isValid: true };
};

export const fullName = (value: string): ValidationResult => {
  if (!value.trim()) {
    return {
      isValid: false,
      error: 'Full name is required',
    };
  }

  if (!/^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/.test(value.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid full name',
    };
  }

  return { isValid: true };
};