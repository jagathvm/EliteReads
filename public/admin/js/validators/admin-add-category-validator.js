export const addCategoryValidator = new JustValidate("#addCategoryForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
  successFieldCssClass: "success-field",
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
  // Category Slug
  .addField("#category_slug", [
    {
      rule: "required",
      errorMessage: "Slug is required",
    },
    {
      rule: "customRegexp",
      value: /^[a-z0-9-]+$/, // Ensures only lowercase letters, numbers, and dashes
      errorMessage:
        "Slug must be in lowercase and contain only letters, numbers, and dashes",
    },
    {
      rule: "minLength",
      value: 3, // Optional: minimum slug length
      errorMessage: "Slug must be at least 3 characters long",
    },
    {
      rule: "maxLength",
      value: 100, // Optional: maximum slug length
      errorMessage: "Slug must be less than 100 characters",
    },
  ])
  // Parent Category
  .addField("#parent_category", [
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
