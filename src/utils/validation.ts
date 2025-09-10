/**
 * Validation utilities for form fields
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates postcode format (Australian postcode pattern)
 */
export const validatePostcode = (postcode: string): ValidationResult => {
  if (!postcode.trim()) {
    return { isValid: false, errorMessage: "Postcode is required" };
  }

  // Australian postcode pattern: 4 digits (e.g., 2000, 3000, 4000)
  const postcodePattern = /^\d{4}$/;
  
  if (!postcodePattern.test(postcode.trim())) {
    return { isValid: false, errorMessage: "Please enter a valid Australian postcode (e.g., 2000, 3000)" };
  }

  return { isValid: true };
};

/**
 * Validates house number
 */
export const validateHouseNumber = (houseNumber: string): ValidationResult => {
  if (!houseNumber.trim()) {
    return { isValid: false, errorMessage: "House number is required" };
  }

  // House number should be alphanumeric and reasonable length
  const houseNumberPattern = /^[0-9A-Za-z\-\/]{1,10}$/;
  
  if (!houseNumberPattern.test(houseNumber.trim())) {
    return { isValid: false, errorMessage: "Please enter a valid house number" };
  }

  return { isValid: true };
};

/**
 * Validates first name
 */
export const validateFirstName = (firstName: string): ValidationResult => {
  if (!firstName.trim()) {
    return { isValid: false, errorMessage: "First name is required" };
  }

  if (firstName.trim().length < 2) {
    return { isValid: false, errorMessage: "First name must be at least 2 characters long" };
  }

  if (firstName.trim().length > 50) {
    return { isValid: false, errorMessage: "First name must be less than 50 characters" };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const namePattern = /^[A-Za-z\s\-\']+$/;
  
  if (!namePattern.test(firstName.trim())) {
    return { isValid: false, errorMessage: "First name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true };
};

/**
 * Validates last name
 */
export const validateLastName = (lastName: string): ValidationResult => {
  if (!lastName.trim()) {
    return { isValid: false, errorMessage: "Last name is required" };
  }

  if (lastName.trim().length < 2) {
    return { isValid: false, errorMessage: "Last name must be at least 2 characters long" };
  }

  if (lastName.trim().length > 50) {
    return { isValid: false, errorMessage: "Last name must be less than 50 characters" };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const namePattern = /^[A-Za-z\s\-\']+$/;
  
  if (!namePattern.test(lastName.trim())) {
    return { isValid: false, errorMessage: "Last name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true };
};

/**
 * Validates address selection
 */
export const validateAddressSelection = (selectedAddress: string, addresses: any[]): ValidationResult => {
  if (!selectedAddress) {
    return { isValid: false, errorMessage: "Please select an address" };
  }

  if (!addresses.length) {
    return { isValid: false, errorMessage: "No addresses available. Please search for an address first" };
  }

  const foundAddress = addresses.find(address => address.id === selectedAddress);
  
  if (!foundAddress) {
    return { isValid: false, errorMessage: "Selected address not found" };
  }

  return { isValid: true };
};

/**
 * Validates the entire address form
 */
export const validateAddressForm = (postCode: string, houseNumber: string): ValidationResult => {
  const postcodeValidation = validatePostcode(postCode);
  if (!postcodeValidation.isValid) {
    return postcodeValidation;
  }

  const houseNumberValidation = validateHouseNumber(houseNumber);
  if (!houseNumberValidation.isValid) {
    return houseNumberValidation;
  }

  return { isValid: true };
};

/**
 * Validates the entire personal info form
 */
export const validatePersonalInfoForm = (
  firstName: string, 
  lastName: string, 
  selectedAddress: string, 
  addresses: any[]
): ValidationResult => {
  const firstNameValidation = validateFirstName(firstName);
  if (!firstNameValidation.isValid) {
    return firstNameValidation;
  }

  const lastNameValidation = validateLastName(lastName);
  if (!lastNameValidation.isValid) {
    return lastNameValidation;
  }

  const addressValidation = validateAddressSelection(selectedAddress, addresses);
  if (!addressValidation.isValid) {
    return addressValidation;
  }

  return { isValid: true };
};
