export const userLoginValidator = new JustValidate("#formLogIn", {
  errorFieldCssClass: "error-field", // Class applied to error fields
  errorLabelCssClass: "error-label", // Class applied to error messages
  successFieldCssClass: "success-field", // Class applied to valid fields
});

userLoginValidator
  .addField("#emailOrPhone", [
    {
      rule: "required",
      errorMessage: "Email or Phone is required",
    },
    {
      validator: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[6-9]\d{9}$/;

        return emailPattern.test(value) || phonePattern.test(value);
      },
      errorMessage: "Enter a valid email or phone number",
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
      errorMessage: "Password must be at least 8 characters long",
    },
    {
      rule: "maxLength",
      value: 16,
      errorMessage: "Password must not exceed 16 characters",
    },
  ]);

// Attach 'blur' event listeners to trigger validation on focus out
document.querySelectorAll("#formLogIn input").forEach((input) => {
  input.addEventListener("blur", () => {
    const selector = `#${input.id}`;
    userLoginValidator.revalidateField(selector);

    input.addEventListener("input", () => {
      const selector = `#${input.id}`;
      userLoginValidator.revalidateField(selector);
    });
  });
});
