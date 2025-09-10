import { useState, useCallback } from 'react';
import { useFieldValidation, FieldValidation } from './useFieldValidation';

export interface FormFields {
  [key: string]: string;
}

export interface UseFormFieldsReturn {
  formFields: FormFields;
  handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFieldValue: (fieldName: string, value: string) => void;
  clearAllFields: () => void;
  setError: (error: string | undefined) => void;
  error: string | undefined;
  setAddresses: (addresses: any[]) => void;
  addresses: any[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fieldValidations: FieldValidation;
  validateField: (fieldName: string, value: string) => void;
  markFieldTouched: (fieldName: string) => void;
  clearFieldValidation: (fieldName: string) => void;
  clearAllValidations: () => void;
  isFormValid: boolean;
}


export const useFormFields = (initialFields: FormFields = {}): UseFormFieldsReturn => {
  const [formFields, setFormFields] = useState<FormFields>(initialFields);
  const [error, setError] = useState<string | undefined>(undefined);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Field validation hook
  const {
    fieldValidations,
    validateField: validateFieldValue,
    markFieldTouched,
    clearFieldValidation,
    clearAllValidations,
    isFormValid
  } = useFieldValidation();

  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field on change
    validateFieldValue(name, value);
  }, [validateFieldValue]);

  const setFieldValue = useCallback((fieldName: string, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Validate field when value is set
    validateFieldValue(fieldName, value);
  }, [validateFieldValue]);

  /**
   * Clear all form fields and reset to initial state
   */
  const clearAllFields = useCallback(() => {
    setFormFields(initialFields);
    setError(undefined);
    setAddresses([]);
    setLoading(false);
    clearAllValidations();
  }, [initialFields, clearAllValidations]);

  return {
    formFields,
    handleFieldChange,
    setFieldValue,
    clearAllFields,
    setError,
    error,
    setAddresses,
    addresses,
    loading,
    setLoading,
    fieldValidations,
    validateField: validateFieldValue,
    markFieldTouched,
    clearFieldValidation,
    clearAllValidations,
    isFormValid
  };
};
