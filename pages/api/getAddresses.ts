import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  // Normalize query parameters to single strings
  const postcodeStr = Array.isArray(postcode) ? postcode[0] : postcode ?? '';
  const streetnumberStr = Array.isArray(streetnumber) ? streetnumber[0] : streetnumber ?? '';

  if (!postcodeStr || !streetnumberStr) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcodeStr.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  /** Implement the validation logic to ensure input value
   *  is all digits and non negative
   */
  const isStrictlyNumeric = (value: string): boolean => {
    return /^\d+$/.test(value) && parseInt(value, 10) >= 0;
  };

  /** Refactored validation function to eliminate duplication of logic for postCode/streetNumber digit checks */
  const validateNumericField = (value: string, fieldName: string) => {
    if (!isStrictlyNumeric(value)) {
      return res.status(400).send({
        status: "error",
        errormessage: `${fieldName} must be all digits and non negative!`,
      });
    }
    return null; // Indicates validation passed
  };

  // Validate postcode and street number using the refactored function
  const postcodeValidation = validateNumericField(postcodeStr, "Postcode");
  if (postcodeValidation) return postcodeValidation;

  const streetNumberValidation = validateNumericField(streetnumberStr, "Street Number");
  if (streetNumberValidation) return streetNumberValidation;

  const mockAddresses = generateMockAddresses(
    postcodeStr,
    streetnumberStr
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
