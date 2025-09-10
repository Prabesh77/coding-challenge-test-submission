import { useState, useCallback, useEffect } from 'react';
import { 
  validatePostcode, 
  validateHouseNumber, 
  validateFirstName, 
  validateLastName,
  ValidationResult 
} from '../utils/validation';

export interface FieldValidation {
  [fieldName: string]: {
    isValid: boolean;
    errorMessage?: string;
    touched: boolean;
  };
}

export interface UseFieldValidationReturn {
  fieldValidations: FieldValidation;
  validateField: (fieldName: string, value: string) => ValidationResult;
  markFieldTouched: (fieldName: string) => void;
  clearFieldValidation: (fieldName: string) => void;
  clearAllValidations: () => void;
  isFormValid: boolean;
}

export const useFieldValidation = (): UseFieldValidationReturn => {
  const [fieldValidations, setFieldValidations] = useState<FieldValidation>({});

  const validateField = useCallback((fieldName: string, value: string): ValidationResult => {
    let validation: ValidationResult;

    switch (fieldName) {
      case 'postCode':
        validation = validatePostcode(value);
        break;
      case 'houseNumber':
        validation = validateHouseNumber(value);
        break;
      case 'firstName':
        validation = validateFirstName(value);
        break;
      case 'lastName':
        validation = validateLastName(value);
        break;
      default:
        validation = { isValid: true };
    }

    setFieldValidations(prev => ({
      ...prev,
      [fieldName]: {
        isValid: validation.isValid,
        errorMessage: validation.errorMessage,
        touched: prev[fieldName]?.touched || false
      }
    }));

    return validation;
  }, []);

  const markFieldTouched = useCallback((fieldName: string) => {
    setFieldValidations(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true
      }
    }));
  }, []);

  const clearFieldValidation = useCallback((fieldName: string) => {
    setFieldValidations(prev => {
      const newValidations = { ...prev };
      delete newValidations[fieldName];
      return newValidations;
    });
  }, []);

  const clearAllValidations = useCallback(() => {
    setFieldValidations({});
  }, []);

  const isFormValid = Object.values(fieldValidations).every(
    validation => validation.isValid || !validation.touched
  );

  return {
    fieldValidations,
    validateField,
    markFieldTouched,
    clearFieldValidation,
    clearAllValidations,
    isFormValid
  };
};
