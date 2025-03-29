// Initialize JustValidate
export const userAddressValidator = new JustValidate("#postUserAddressForm");

userAddressValidator
  .addField('[name="name"]', [
    {
      rule: "required",
      errorMessage: "Name is required",
    },
    {
      rule: "minLength",
      value: 3,
      errorMessage: "Name must be at least 3 characters",
    },
  ])
  .addField('[name="phone"]', [
    {
      rule: "required",
      errorMessage: "Phone number is required",
    },
    {
      rule: "customRegexp",
      value: /^[6-9]\d{9}$/,
      errorMessage: "Phone number must be valid (10 digits starting with 6-9)",
    },
  ])
  .addField('[name="pincode"]', [
    {
      rule: "required",
      errorMessage: "Pincode is required",
    },
    {
      rule: "number",
      errorMessage: "Pincode must be a number",
    },
    {
      rule: "minLength",
      value: 6,
      errorMessage: "Pincode must be 6 digits",
    },
    {
      rule: "maxLength",
      value: 6,
      errorMessage: "Pincode must be 6 digits",
    },
  ])
  .addField('[name="locality"]', [
    {
      rule: "required",
      errorMessage: "Locality is required",
    },
  ])
  .addField('[name="street"]', [
    {
      rule: "required",
      errorMessage: "Street address is required",
    },
  ])
  .addField('[name="city"]', [
    {
      rule: "required",
      errorMessage: "City/District/Town is required",
    },
  ])
  .addField('[name="state"]', [
    {
      rule: "required",
      errorMessage: "State is required",
    },
  ])
  .addField('[name="address_type"]', [
    {
      rule: "required",
      errorMessage: "Address type is required",
    },
  ]);
