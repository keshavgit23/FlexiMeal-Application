import { useState } from 'react';
import type { ValidationResult } from '../utils/validation';

type Errors = Record<string, string>;

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Errors>({});

  const validateField = (
    fieldName: string,
    validation: ValidationResult
  ) => {
    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validation.error ?? '',
      }));

      return false;
    }

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });

    return true;
  };

  const clearError = (fieldName: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    clearError,
    clearErrors,
  };
};