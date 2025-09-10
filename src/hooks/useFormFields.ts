import { useState, useCallback } from 'react';

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
}


export const useFormFields = (initialFields: FormFields = {}): UseFormFieldsReturn => {
  const [formFields, setFormFields] = useState<FormFields>(initialFields);
  const [error, setError] = useState<string | undefined>(undefined);
  const [addresses, setAddresses] = useState<any[]>([]);


  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);


  const setFieldValue = useCallback((fieldName: string, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  /**
   * Clear all form fields and reset to initial state
   */
  const clearAllFields = useCallback(() => {
    setFormFields(initialFields);
    setError(undefined);
    setAddresses([]);
  }, [initialFields]);

  return {
    formFields,
    handleFieldChange,
    setFieldValue,
    clearAllFields,
    setError,
    error,
    setAddresses,
    addresses
  };
};
