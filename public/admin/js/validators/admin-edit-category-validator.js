// Initialize JustValidate for the edit category form
export const editCategoryValidator = new JustValidate("#editCategoryForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
});

editCategoryValidator
  // Category Name
  .addField("#edit_category_name", [
    {
      rule: "required",
      errorMessage: "Category name is required",
    },
    {
      rule: "minLength",
      value: 3,
      errorMessage: "Category name must be at least 3 characters long",
    },
    {
      rule: "maxLength",
      value: 100,
      errorMessage: "Category name must be less than 100 characters",
    },
  ])

  // Category Description
  .addField("#edit_category_description", [
    {
      rule: "required",
      errorMessage: "Description is required",
    },
    {
      rule: "minLength",
      value: 10,
      errorMessage: "Description must be at least 10 characters long",
    },
    {
      rule: "maxLength",
      value: 500,
      errorMessage: "Description must be less than 500 characters",
    },
  ])

  // Category Slug
  .addField("#edit_category_slug", [
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
      value: 3,
      errorMessage: "Slug must be at least 3 characters long",
    },
    {
      rule: "maxLength",
      value: 100,
      errorMessage: "Slug must be less than 100 characters",
    },
  ])

  // Parent Category
  .addField("#edit_category_parent", [
    {
      rule: "custom",
      validator: (value) => {
        // Allow "None" or any valid category name
        return value === "" || value !== "";
      },
      errorMessage: "Parent category selection is invalid.",
    },
  ]);

// Revalidate fields on input or blur
document
  .querySelectorAll(
    "#editCategoryForm input, #editCategoryForm textarea, #editCategoryForm select"
  )
  .forEach((element) => {
    const selector = `#${element.id}`;

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.addEventListener("blur", () => {
        editCategoryValidator.revalidateField(selector);
      });

      element.addEventListener("input", () => {
        editCategoryValidator.revalidateField(selector);
      });
    }

    if (element.tagName === "SELECT") {
      element.addEventListener("change", () => {
        editCategoryValidator.revalidateField(selector);
      });

      element.addEventListener("blur", () => {
        editCategoryValidator.revalidateField(selector);
      });
    }
  });
