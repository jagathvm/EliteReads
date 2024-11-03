export const userLoginValidator = new JustValidate("#formLogIn", {
  errorFieldCssClass: "error-field", // Class applied to error fields
  errorLabelCssClass: "error-label", // Class applied to error messages
  successFieldCssClass: "success-field", // Class applied to valid fields
});

userLoginValidator
  .addField("#usernameEmailPhone", [
    {
      rule: "required",
      errorMessage: "This field is required",
    },
    {
      validator: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[6-9]\d{9}$/;
        const usernamePattern = /^[a-z0-9_]{3,20}$/; // Username: lowercase letters, numbers, underscores, 3-20 chars

        // Check if it matches any valid format
        if (emailPattern.test(value)) return true;
        if (phonePattern.test(value)) return true;
        if (usernamePattern.test(value)) return true;

        // If no pattern matches, return false
        return false;
      },
      errorMessage: (value) => {
        // Specific error messages based on the failed pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[6-9]\d{9}$/;
        const usernamePattern = /^[a-z0-9_]{3,20}$/;

        if (!usernamePattern.test(value)) {
          return "Username must be 3-20 characters, using only lowercase letters, numbers, and underscores";
        } else if (!emailPattern.test(value)) {
          return "Enter a valid email address";
        } else if (!phonePattern.test(value)) {
          return "Enter a valid phone number (10 digits, starting with 6-9)";
        }
        return "Invalid input"; // Fallback message
      },
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
