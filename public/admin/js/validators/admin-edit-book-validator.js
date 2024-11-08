export const editBookDetailsValidator = new JustValidate("#editBookForm", {
  errorFieldCssClass: "error-field",
  errorLabelCssClass: "error-label",
});

// Regular expression to enforce no spaces and only numbers for numeric fields
const numberRegex = /^[0-9]+$/;

// Regular expression to enforce the following:
// - Starts with an uppercase letter
// - Only one space between words
// - No trailing spaces
const capitalizedRegex = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;

editBookDetailsValidator
  // Book Title
  .addField("#editTitle", [
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

  // Author
  .addField("#editAuthor", [
    {
      rule: "required",
      errorMessage: "Author is required",
    },
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Names must start with a capital letter, only one space between words, and no trailing spaces",
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
    {
      rule: "customRegexp",
      value: /^[0-9]+(\.[0-9]{1,2})?$/,
      errorMessage:
        "Price must be a valid positive number, with up to two decimal places, and no spaces",
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
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Publisher name must start with a capital letter, only one space between words, and no trailing spaces",
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
    {
      rule: "customRegexp",
      value: numberRegex,
      errorMessage: "Year must be a valid number with no spaces",
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
    {
      rule: "customRegexp",
      value: capitalizedRegex,
      errorMessage:
        "Language must start with a capital letter, only one space between words, and no trailing spaces",
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
    {
      rule: "customRegexp",
      value: numberRegex,
      errorMessage: "Pages must be a number with no spaces",
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
    {
      rule: "customRegexp",
      value: numberRegex,
      errorMessage: "Weight must be a number with no spaces",
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

export const editBookImageValidator = new JustValidate(
  "#updateCoverImageForm",
  {
    errorFieldCssClass: "error-field",
    errorLabelCssClass: "error-label",
    successFieldCssClass: "success-field",
  }
);

// Constants
const MAX_IMAGES_ALLOWED = 6;

// Track the initial number of existing images
let existingImagesCount =
  coverImagePreviews.querySelectorAll(".preview-container").length;
let newImagesCount = 0;
let imageRemoved = false;

// Update the file input validation rule based on remaining slots
function updateFileInputValidation() {
  const remainingSlots = MAX_IMAGES_ALLOWED - existingImagesCount;
  editBookImageValidator.addField("#updateCoverImage", [
    {
      rule: "minFilesCount",
      // Require at least 1 new image if no existing images,
      value: existingImagesCount === 0 ? 1 : 0,
      errorMessage: "Upload at least one image.",
    },
    {
      rule: "maxFilesCount",
      value: remainingSlots,
      errorMessage: `You can only upload up to ${remainingSlots} new image(s).`,
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
}

// Initialize validation on load
updateFileInputValidation();

// Update image counters and validation when a new image is added
updateCoverImage.addEventListener("change", function (event) {
  const selectedFiles = Array.from(event.target.files);
  newImagesCount = selectedFiles.length;

  // Update validation rules based on the new image count
  updateFileInputValidation();
});

// Adjust counters and validation when an image is removed
coverImagePreviews.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-preview-image")) {
    const imageContainer = e.target.closest(".preview-container");
    imageContainer.remove();

    // Update the count of existing images
    existingImagesCount--;
    updateFileInputValidation();
  }
});

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
