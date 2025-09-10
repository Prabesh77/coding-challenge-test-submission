/**
 * Validation utilities for form fields
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Name validation constants
const NAME_MIN = 2;
const NAME_MAX = 50;
const NAME_PATTERN = /^[\p{L}\p{M}\s\-\u2019']+$/u;

/**
 * Helper function to validate names with Unicode support
 */
const validateName = (label: "First name" | "Last name", input: string): ValidationResult => {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return { isValid: false, errorMessage: `${label} is required` };
  }

  if (trimmedInput.length < NAME_MIN) {
    return { isValid: false, errorMessage: `${label} must be at least ${NAME_MIN} characters long` };
  }

  if (trimmedInput.length > NAME_MAX) {
    return { isValid: false, errorMessage: `${label} must be less than ${NAME_MAX} characters` };
  }

  if (!NAME_PATTERN.test(trimmedInput)) {
    return { isValid: false, errorMessage: `${label} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true };
};

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
  return validateName("First name", firstName);
};

/**
 * Validates last name
 */
export const validateLastName = (lastName: string): ValidationResult => {
  return validateName("Last name", lastName);
};

/**
 * Validates address selection
 */
export const validateAddressSelection = (selectedAddress: string | number | null | undefined, addresses: { id: string }[]): ValidationResult => {
  // Check for null/undefined explicitly instead of falsy check
  if (selectedAddress == null) {
    return { isValid: false, errorMessage: "Please select an address" };
  }

  // Use explicit length check instead of falsy check
  if (addresses.length === 0) {
    return { isValid: false, errorMessage: "No addresses available. Please search for an address first" };
  }

  // Normalize types when comparing to handle string/number ID mismatches
  const foundAddress = addresses.find(address => String(address.id) === String(selectedAddress));
  
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
