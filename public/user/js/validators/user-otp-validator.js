export const userOtpValidator = new JustValidate("#formOtp", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
  successFieldCssClass: "success-field",
});

userOtpValidator.addField("#otp", [
  {
    rule: "required",
    errorMessage: "OTP is required",
  },
  {
    rule: "maxLength",
    value: 6,
    errorMessage: "OTP must be 6 digits long",
  },
  {
    rule: "customRegexp",
    value: /^[0-9]+$/,
    errorMessage: "OTP must contain only digits",
  },
]);
