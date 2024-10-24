export const userSignupValidator = new JustValidate("#formSignUp", {
  errorFieldCssClass: "error-field", // Class applied to error fields
  errorLabelCssClass: "error-label", // Class applied to error messages
  successFieldCssClass: "success-field", // Class applied to valid fields
});

userSignupValidator
  .addField("#email", [
    {
      rule: "required",
      errorMessage: "Email is required",
    },
    {
      rule: "email",
      errorMessage: "Email is invalid",
    },
  ])
  .addField("#phone", [
    {
      rule: "required",
      errorMessage: "Phone number is required",
    },
    {
      rule: "customRegexp",
      value: /^[6-9]/,
      errorMessage: "Phone number must start with a digit between 6 and 9",
    },
    {
      rule: "customRegexp",
      value: /^[6-9]\d{9}$/,
      errorMessage: "Phone number must be exactly 10 digits",
    },
  ])
  .addField("#password", [
    {
      rule: "required",
      errorMessage: "Password is required",
    },
    {
      rule: "minLength",
      value: 8,
      errorMessage: "Password must contain minimum 8 characters",
    },
    {
      rule: "password",
      errorMessage: "Password must contain atleast one letter",
      errorMessage: "Password must contain atleast one number",
    },
    {
      rule: "customRegexp",
      value: /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/,
      errorMessage: "Password must contain at least one special character",
    },
    {
      rule: "maxLength",
      value: 16,
      errorMessage: "Password must not exceed 16 characters",
    },
  ])
  .addField("#passwordConfirm", [
    {
      rule: "required",
      errorMessage: "You must retype your password",
    },
    {
      validator: (value, fields) => {
        if (fields["#password"] && fields["#password"].elem) {
          const repeatPasswordValue = fields["#password"].elem.value;
          return value === repeatPasswordValue;
        }
        return true; // If the password field is not available, consider the confirmation valid.
      },
      errorMessage: "Passwords should be the same",
    },
  ])
  .addField("#checkbox", [
    {
      rule: "required",
      errorMessage: "You must agree to the terms and policy",
    },
  ]);

// Attach 'blur' event listeners to trigger validation on focus out
document.querySelectorAll("#formSignUp input").forEach((input) => {
  input.addEventListener("blur", () => {
    const selector = `#${input.id}`;
    userSignupValidator.revalidateField(selector);
  });
});
