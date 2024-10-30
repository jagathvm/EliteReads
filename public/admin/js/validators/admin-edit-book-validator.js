export const editBookValidator = new JustValidate("#editBookForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
});

editBookValidator
  // File Input (Book Cover Image)
  .addField("#editCoverImage", [
    {
      validator: (value, fields) => {
        const fileInput = fields["#editCoverImage"].elem;
        return fileInput.files.length === 0 || fileInput.files.length >= 1;
      },
      errorMessage: "Upload at least one image.",
    },
    {
      validator: (value, fields) => {
        const fileInput = fields["#editCoverImage"].elem;
        return fileInput.files.length === 0 || fileInput.files.length <= 6;
      },
      errorMessage: "Uploading more than 6 images is not allowed.",
    },
    {
      validator: (value, fields) => {
        const fileInput = fields["#editCoverImage"].elem;
        if (fileInput.files.length === 0) return true; // Skip validation if no files
        return Array.from(fileInput.files).every(
          (file) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file.type) &&
            file.size >= 10000 &&
            file.size <= 2000000
        );
      },
      errorMessage:
        "Please upload a valid image (JPEG/JPG/PNG, size 10KB - 2MB).",
    },
  ])

  // // File Input (Book Cover Image)
  // .addField("#editCoverImage", [
  //   {
  //     rule: "minFilesCount",
  //     value: 1,
  //     errorMessage: "Upload atleast one image.",
  //   },
  //   {
  //     rule: "maxFilesCount",
  //     value: 6,
  //     errorMessage: "Uploading more than 6 images is not allowed.",
  //   },
  //   {
  //     rule: "files",
  //     value: {
  //       files: {
  //         types: ["image/jpeg", "image/png", "image/jpg"],
  //         minSize: 10000,
  //         maxSize: 2000000,
  //       },
  //     },
  //     errorMessage:
  //       "Please upload a valid image (JPEG/JPG/PNG, size 10KB - 2MB)",
  //   },
  // ])

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
    "#editBookForm input, #editBookForm textarea, #editBookForm select"
  )
  .forEach((element) => {
    const selector = `#${element.id}`;

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.addEventListener("blur", () => {
        editBookValidator.revalidateField(selector);
      });

      element.addEventListener("input", () => {
        editBookValidator.revalidateField(selector);
      });
    }

    if (element.tagName === "SELECT") {
      element.addEventListener("change", () => {
        editBookValidator.revalidateField(selector);
      });

      // Add blur event for SELECT elements
      element.addEventListener("blur", () => {
        editBookValidator.revalidateField(selector);
      });
    }
  });
