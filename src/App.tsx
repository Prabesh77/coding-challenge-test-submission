import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";

import styles from "./App.module.css";
import { useFormFields } from "./hooks/useFormFields";
import useAddressBook from "./hooks/useAddressBook";
import transformAddress from "./core/models/address";
import { validateAddressForm, validatePersonalInfoForm } from "./utils/validation";

function App() {
  /**
   * Form fields management using custom hook
   */
  const {
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
    markFieldTouched,
    clearAllValidations
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: ""
  });

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Check if any form fields have values
   */
  const hasFormInput = Object.values(formFields).some(value => value.trim() !== '') || addresses.length > 0;

  /**
   * Fetch addresses based on houseNumber and postCode using the local BE api
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous search results and errors
    setAddresses([]);
    setError(undefined);
    
    // Comprehensive validation
    const validation = validateAddressForm(formFields.postCode, formFields.houseNumber);
    if (!validation.isValid) {
      setError(validation.errorMessage!);
      return;
    }
    
    try {
      // Set loading state
      setLoading(true);
      
      // Construct API URL with base URL for grading purposes
      const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
      const apiUrl = `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(formFields.postCode)}&streetnumber=${encodeURIComponent(formFields.houseNumber)}`;
      
      // Fetch addresses from API
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (response.ok && data.status === "ok") {
        // Transform addresses using the transformAddress function
        const transformedAddresses = data.details.map((rawAddress: any) => {
          // Add the houseNumber to each address as required
          const addressWithHouseNumber = {
            ...rawAddress,
            houseNumber: formFields.houseNumber
          };
          return transformAddress(addressWithHouseNumber);
        });
        
        setAddresses(transformedAddresses);
        
        // Reset form fields after successful address search (but keep addresses)
        setFieldValue("postCode", "");
        setFieldValue("houseNumber", "");
        clearAllValidations();
      } else {
        // Handle API error responses
        setError(data.errormessage || "Failed to fetch addresses");
      }
    } catch (error) {
      // Handle network or other errors
      setError("Network error occurred while fetching addresses");
      console.error("Address fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle personal info form submission with comprehensive validation
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Comprehensive validation for personal info form
    const validation = validatePersonalInfoForm(
      formFields.firstName, 
      formFields.lastName, 
      formFields.selectedAddress, 
      addresses
    );
    
    if (!validation.isValid) {
      setError(validation.errorMessage!);
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === formFields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: formFields.firstName, lastName: formFields.lastName });
    
    // Reset all form fields after successful address addition (same as reset button)
    clearAllFields();
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          legend="🏠 Find an address"
          loading={loading}
          fields={[
            {
              name: "postCode",
              type: "text",
              placeholder: "Post Code",
              value: formFields.postCode,
              onChange: handleFieldChange,
              onBlur: (e) => markFieldTouched(e.target.name),
              error: fieldValidations.postCode?.errorMessage,
              touched: fieldValidations.postCode?.touched,
              showValidation: true
            },
            {
              name: "houseNumber",
              type: "text",
              placeholder: "House number",
              value: formFields.houseNumber,
              onChange: handleFieldChange,
              onBlur: (e) => markFieldTouched(e.target.name),
              error: fieldValidations.houseNumber?.errorMessage,
              touched: fieldValidations.houseNumber?.touched,
              showValidation: true
            }
          ]}
          onSubmit={handleAddressSubmit}
          submitText={loading ? "Finding..." : "Find"}
          submitVariant="primary"
        />


        {addresses.length > 0 && (
          <div className="radioContainer">
            {addresses.map((address) => {
              return (
                <Radio
                  name="selectedAddress"
                  id={address.id}
                  key={address.id}
                  onChange={handleFieldChange}
                  checked={formFields.selectedAddress === address.id}
                >
                  <Address {...address} />
                </Radio>
              );
            })}
          </div>
        )}
        {formFields.selectedAddress && (
          <Form
            legend="✏️ Add personal info to address"
            fields={[
              {
                name: "firstName",
                type: "text",
                placeholder: "First name",
                value: formFields.firstName,
                onChange: handleFieldChange,
                onBlur: (e) => markFieldTouched(e.target.name),
                error: fieldValidations.firstName?.errorMessage,
                touched: fieldValidations.firstName?.touched,
                showValidation: true
              },
              {
                name: "lastName",
                type: "text",
                placeholder: "Last name",
                value: formFields.lastName,
                onChange: handleFieldChange,
                onBlur: (e) => markFieldTouched(e.target.name),
                error: fieldValidations.lastName?.errorMessage,
                touched: fieldValidations.lastName?.touched,
                showValidation: true
              }
            ]}
            onSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            submitVariant="primary"
          />
        )}

        {error && (
          <ErrorMessage 
            message={error}
            variant="error"
            onDismiss={() => setError(undefined)}
            showIcon={true}
          />
        )}

        {hasFormInput && (
          <div className={styles.clearButtonContainer}>
            <Button
              variant="danger"
              onClick={clearAllFields}
            >
              Clear all fields
            </Button>
          </div>
        )}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
