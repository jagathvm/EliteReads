export const addBookValidator = new JustValidate("#addBookForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
  successFieldCssClass: "success-field",
});

// Regular expression to enforce no spaces and only numbers for numeric fields
const numberRegex = /^[0-9]+$/;

// Regular expression to enforce the following:
// - Starts with an uppercase letter
// - Only one space between words
// - No trailing spaces
const capitalizedRegex = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;

addBookValidator
  // Book Title
  .addField("#book_title", [
    {
      rule: "required",
      errorMessage: "Book title is required",
    },
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Title must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // First Name of Author
  .addField("#author_firstName", [
    {
      rule: "required",
      errorMessage: "Author's first name is required",
    },
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "First name must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Last Name of Author
  .addField("#author_lastName", [
    {
      rule: "required",
      errorMessage: "Author's last name is required",
    },
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Last name must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Description
  .addField("#book_description", [
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
  .addField("#book_price", [
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
    {
      rule: "customRegexp",
      value: /^[0-9]+(\.[0-9]{1,2})?$/,
      errorMessage:
        "Price must be a valid positive number, with up to two decimal places, and no spaces",
    },
  ])

  // ISBN (exactly 13 digits)
  .addField("#book_isbn", [
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
  .addField("#book_publisher", [
    {
      rule: "required",
      errorMessage: "Publisher is required",
    },
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Publisher name must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Publication Year
  .addField("#book_year", [
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
    {
      rule: "customRegexp",
      value: numberRegex,
      errorMessage: "Year must be a valid number with no spaces",
    },
  ])

  // Language
  .addField("#book_language", [
    {
      rule: "required",
      errorMessage: "Language is required",
    },
    {
      rule: "minLength",
      value: 2,
      errorMessage: "Language must be at least 2 characters long",
    },
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Language must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Pages
  .addField("#book_pages", [
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
    {
      rule: "customRegexp",
      value: numberRegex,
      errorMessage: "Pages must be a number with no spaces",
    },
  ])

  // Weight
  .addField("#book_weight", [
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
    {
      rule: "customRegexp",
      value: numberRegex,
      errorMessage: "Weight must be a number with no spaces",
    },
  ])

  // Featured
  .addField("#book_featured", [
    {
      rule: "customRegexp",
      value: /.+/, // Custom validation rule: match any value
      errorMessage: "Please select the featured option if necessary",
    },
  ])

  // Category (ensure selection)
  .addField("#book_category", [
    {
      rule: "required",
      errorMessage: "Category is required",
    },
  ])

  // Subcategory (ensure selection)
  .addField("#book_subcategory", [
    {
      rule: "minLength",
      value: 1,
      errorMessage: "Subcategory selection is invalid",
    },
  ])

  // File input (cover image)
  .addField("#book_cover_image", [
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
  ]);

// Attach event listeners
document
  .querySelectorAll(
    "#addBookForm input, #addBookForm textarea, #addBookForm select"
  )
  .forEach((element) => {
    const selector = `#${element.id}`;

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.addEventListener("blur", () => {
        addBookValidator.revalidateField(selector);
      });

      element.addEventListener("input", () => {
        addBookValidator.revalidateField(selector);
      });
    }

    if (element.tagName === "SELECT") {
      element.addEventListener("change", () => {
        addBookValidator.revalidateField(selector);
      });

      // Add blur event for SELECT elements
      element.addEventListener("blur", () => {
        addBookValidator.revalidateField(selector);
      });
    }
  });
