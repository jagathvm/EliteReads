export const addCategoryValidator = new JustValidate("#addCategoryForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
  successFieldCssClass: "success-field",
  focusInvalidField: true,
});

addCategoryValidator
  // Category Name
  .addField("#category_name", [
    {
      rule: "required",
      errorMessage: "Category name is required",
    },
    {
      rule: "minLength",
      value: 3, // Match server-side minimum of 3
      errorMessage: "Category name must be at least 3 characters long",
    },
    {
      rule: "maxLength",
      value: 100,
      errorMessage: "Category name must be less than 100 characters",
    },
    {
      rule: "customRegexp",
      value: /^[^\s]+(\s+[^\s]+)*$/, // No trailing spaces
      errorMessage: "Category name should not start or end with a space",
    },
  ])
  // Category Description
  .addField("#category_description", [
    {
      rule: "required",
      errorMessage: "Description is required",
    },
    {
      rule: "minLength",
      value: 10, // Match server-side minimum of 10
      errorMessage: "Description must be at least 10 characters long",
    },
    {
      rule: "maxLength",
      value: 500,
      errorMessage: "Description must be less than 500 characters",
    },
  ])
  // Parent Category
  .addField("#parentCategory", [
    {
      rule: "custom",
      validator: (value) => {
        // Allow "None" or any valid category name
        return value === "" || value !== "";
      },
      errorMessage: "Parent category selection is invalid.",
    },
  ]);

// Attach revalidation to form inputs
document
  .querySelectorAll(
    "#addCategoryForm input, #addCategoryForm textarea, #addCategoryForm select"
  )
  .forEach((element) => {
    const selector = `#${element.id}`;

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.addEventListener("blur", () => {
        addCategoryValidator.revalidateField(selector);
      });

      element.addEventListener("input", () => {
        addCategoryValidator.revalidateField(selector);
      });
    }

    if (element.tagName === "SELECT") {
      element.addEventListener("change", () => {
        addCategoryValidator.revalidateField(selector);
      });

      element.addEventListener("blur", () => {
        addCategoryValidator.revalidateField(selector);
      });
    }
  });
