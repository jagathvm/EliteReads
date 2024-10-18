export const adminLoginValidator = new JustValidate("#formLogIn", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
  successFieldCssClass: "success-field",
});

adminLoginValidator
  .addField("#email", [
    {
      rule: "required",
      errorMessage: "Email is required",
    },
    {
      rule: "email",
      errorMessage: "Enter a valid email",
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
  ]);

// Attach 'blur' event listeners to trigger validation on focus out
document.querySelectorAll("#formLogIn input").forEach((input) => {
  input.addEventListener("blur", () => {
    const selector = `#${input.id}`;
    adminLoginValidator.revalidateField(selector);

    input.addEventListener("input", () => {
      const selector = `#${input.id}`;
      adminLoginValidator.revalidateField(selector);
    });
  });
});
