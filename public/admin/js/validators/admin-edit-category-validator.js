// Initialize JustValidate for the edit category form
export const editCategoryValidator = new JustValidate("#editCategoryForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
});

editCategoryValidator
  // Category Name
  .addField("#edit_category_name", [
    {
      rule: "custom",
      validator: (value) => {
        // Skip validation if the field is empty (optional field)
        if (value === "") return true;
        // Validate if the field is not empty
        return value.length >= 3 && value.length <= 100;
      },
      errorMessage: "Category name must be between 3 and 100 characters",
    },
  ])

  // Category Description
  .addField("#edit_category_description", [
    {
      rule: "custom",
      validator: (value) => {
        // Skip validation if the field is empty (optional field)
        if (value === "") return true;
        // Validate if the field is not empty
        return value.length >= 10 && value.length <= 500;
      },
      errorMessage: "Description must be between 10 and 500 characters",
    },
  ])

  // Parent Category
  .addField("#edit_category_parent", [
    {
      rule: "custom",
      validator: (value) => {
        // Skip validation if the field is empty (optional field)
        if (value === "") return true;
        // Allow any valid category name if the field is not empty
        return value !== "";
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
