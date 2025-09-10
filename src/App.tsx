import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";

import styles from "./App.module.css";
import { useFormFields } from "./hooks/useFormFields";
import useAddressBook from "./hooks/useAddressBook";

function App() {
  /**
   * Form fields management using custom hook
   */
  const {
    formFields,
    handleFieldChange,
    clearAllFields,
    setError,
    error,
    setAddresses,
    addresses
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

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation for first name and last name
    if (!formFields.firstName.trim() || !formFields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!formFields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
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
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handleFieldChange}
                placeholder="Post Code"
                value={formFields.postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleFieldChange}
                value={formFields.houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" variant="primary">Find</Button>
            {hasFormInput && (
              <Button
                variant="secondary"
                size="small"
                onClick={clearAllFields}
              >
                Clear all fields
              </Button>
            )}
          </fieldset>
        </form>


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
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {formFields.selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFieldChange}
                  value={formFields.firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleFieldChange}
                  value={formFields.lastName}
                />
              </div>
              <Button type="submit" variant="primary">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
