export const editBookDetailsValidator = new JustValidate("#editBookForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
});

export const editBookImageValidator = new JustValidate(
  "#updateCoverImageForm",
  {
    errorFieldCssClass: "error-field",
    errorLabelCssClass: "error-label",
    successFieldCssClass: "success-field",
  }
);

editBookDetailsValidator
  // Book Title
  .addField("#editTitle", [
    {
      rule: "required",
      errorMessage: "Book title is required",
    },
  ])

  // Author
  .addField("#editAuthor", [
    {
      rule: "required",
      errorMessage: "Author is required",
    },
  ])

  // Description
  .addField("#editDescription", [
    {
      rule: "required",
      errorMessage: "Book description is required",
    },
    {
      rule: "minLength",
      value: 10,
      errorMessage: "Description must be at least 10 characters long",
    },
    {
      rule: "maxLength",
      value: 1000,
      errorMessage: "Description must be less than 1000 characters",
    },
  ])

  // Price (supports decimals)
  .addField("#editPrice", [
    {
      rule: "required",
      errorMessage: "Price is required",
    },
    {
      rule: "number",
      errorMessage: "Price must be a valid number",
    },
    {
      rule: "minNumber",
      value: 0.1,
      errorMessage: "Price must be greater than 0",
    },
  ])

  // ISBN (exactly 13 digits)
  .addField("#editISBN", [
    {
      rule: "required",
      errorMessage: "ISBN is required",
    },
    {
      rule: "customRegexp",
      value: /^[0-9]{13}$/,
      errorMessage: "ISBN must be exactly 13 digits",
    },
  ])

  // Publisher
  .addField("#editPublisher", [
    {
      rule: "required",
      errorMessage: "Publisher is required",
    },
  ])

  // Publication Year
  .addField("#editYear", [
    {
      rule: "required",
      errorMessage: "Publication year is required",
    },
    {
      rule: "number",
      errorMessage: "Publication year must be a number",
    },
    {
      rule: "minNumber",
      value: 1000,
      errorMessage: "Year must be a valid year",
    },
    {
      rule: "maxNumber",
      value: new Date().getFullYear(),
      errorMessage: "Year cannot be in the future",
    },
  ])

  // Language
  .addField("#editLanguage", [
    {
      rule: "required",
      errorMessage: "Language is required",
    },
    {
      rule: "minLength",
      value: 2,
      errorMessage: "Language must be at least 2 characters long",
    },
  ])

  // Pages
  .addField("#editPages", [
    {
      rule: "required",
      errorMessage: "Pages are required",
    },
    {
      rule: "number",
      errorMessage: "Pages must be a number",
    },
    {
      rule: "minNumber",
      value: 1,
      errorMessage: "Pages must be greater than 0",
    },
  ])

  // Weight
  .addField("#editWeight", [
    {
      rule: "required",
      errorMessage: "Weight is required",
    },
    {
      rule: "number",
      errorMessage: "Weight must be a number",
    },
    {
      rule: "minNumber",
      value: 1,
      errorMessage: "Weight must be greater than 0",
    },
  ])

  // Featured
  .addField("#editFeatured", [
    {
      rule: "required",
      errorMessage: "Please select the featured option",
    },
  ])

  // Category
  .addField("#editCategory", [
    {
      rule: "required",
      errorMessage: "Category is required",
    },
  ])

  // Subcategory
  .addField("#editSubcategory", [
    {
      rule: "minLength",
      value: 1,
      errorMessage: "Subcategory selection is invalid",
    },
  ]);

editBookImageValidator
  // File Input (Book Cover Image)
  .addField("#updateCoverImage", [
    {
      rule: "minFilesCount",
      value: 1,
      errorMessage: "Upload atleast one image.",
    },
    {
      rule: "maxFilesCount",
      value: 6,
      errorMessage: "Uploading more than 6 images is not allowed.",
    },
    {
      rule: "files",
      value: {
        files: {
          types: ["image/jpeg", "image/png", "image/jpg"],
          minSize: 10000,
          maxSize: 2000000,
        },
      },
      errorMessage:
        "Please upload a valid image (JPEG/JPG/PNG, size 10KB - 2MB)",
    },
  ])

  // Add the removedImageUrls field
  .addField("#removedImageUrls", [
    {
      validator: (value) => {
        if (value === "") {
          // Allow empty string
          return true;
        }
        try {
          // Check if the value is a valid JSON array of URLs
          const urls = JSON.parse(value);
          return (
            Array.isArray(urls) &&
            urls.every((url) => /^https?:\/\/[^\s]+$/.test(url))
          );
        } catch (e) {
          return false; // Invalid JSON
        }
      },
      errorMessage:
        "Removed image URLs must be an empty string or a valid JSON array of URLs",
    },
  ]);

// Attach event listeners

document
  .querySelectorAll(
    "#editBookForm textarea, #editBookForm select, #updateCoverImageForm input"
  )
  .forEach((element) => {
    const selector = `#${element.id}`;

    if (element.tagName === "TEXTAREA") {
      element.addEventListener("input", () => {
        editBookDetailsValidator.revalidateField(selector);
      });

      element.addEventListener("blur", () => {
        editBookDetailsValidator.revalidateField(selector);
      });
    }

    if (element.tagName === "INPUT") {
      element.addEventListener("input", () => {
        editBookImageValidator.revalidateField(selector);
      });

      element.addEventListener("blur", () => {
        editBookImageValidator.revalidateField(selector);
      });
    }

    if (element.tagName === "SELECT") {
      element.addEventListener("change", () => {
        editBookDetailsValidator.revalidateField(selector);
      });

      element.addEventListener("blur", () => {
        editBookDetailsValidator.revalidateField(selector);
      });
    }
  });
