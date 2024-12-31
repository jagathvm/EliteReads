// Initialize JustValidate for the edit book form
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
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return capitalizedRegex.test(value);
      },
      errorMessage:
        "Title must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Author
  .addField("#editAuthor", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return capitalizedRegex.test(value);
      },
      errorMessage:
        "Author name must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Description
  .addField("#editDescription", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return value.length >= 10 && value.length <= 1000;
      },
      errorMessage:
        "Description must be between 10 and 1000 characters long if provided",
    },
  ])

  // Price
  .addField("#editPrice", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return /^[0-9]+(\.[0-9]{1,2})?$/.test(value) && parseFloat(value) > 0;
      },
      errorMessage:
        "Price must be a valid positive number with up to two decimal places",
    },
  ])

  // ISBN
  .addField("#editISBN", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return /^[0-9]{13}$/.test(value);
      },
      errorMessage: "ISBN must be exactly 13 digits if provided",
    },
  ])

  // Publisher
  .addField("#editPublisher", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return capitalizedRegex.test(value);
      },
      errorMessage:
        "Publisher name must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Publication Year
  .addField("#editYear", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        const year = parseInt(value, 10);
        return (
          numberRegex.test(value) &&
          year >= 1000 &&
          year <= new Date().getFullYear()
        );
      },
      errorMessage:
        "Year must be a valid number between 1000 and the current year",
    },
  ])

  // Language
  .addField("#editLanguage", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return capitalizedRegex.test(value);
      },
      errorMessage:
        "Language must start with a capital letter, only one space between words, and no trailing spaces",
    },
  ])

  // Pages
  .addField("#editPages", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        const pages = parseInt(value, 10);
        return numberRegex.test(value) && pages > 0;
      },
      errorMessage: "Pages must be a valid number greater than 0 if provided",
    },
  ])

  // Weight
  .addField("#editWeight", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        const weight = parseInt(value, 10);
        return numberRegex.test(value) && weight > 0;
      },
      errorMessage: "Weight must be a valid number greater than 0 if provided",
    },
  ])

  // Featured
  .addField("#editFeatured", [
    {
      rule: "custom",
      validator: (value) => {
        // Skip validation if empty
        if (value === "") return true;
        // Validate only "true" or "false"
        return value === "true" || value === "false";
      },
      errorMessage: "Please select a valid option for featured",
    },
  ])

  // Category
  .addField("#editCategory", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return true; // Additional validation logic can be added if needed
      },
      errorMessage: "Category selection is invalid",
    },
  ])

  // Subcategory
  .addField("#editSubcategory", [
    {
      rule: "custom",
      validator: (value) => {
        if (value === "") return true; // Skip validation if empty
        return value.length >= 1;
      },
      errorMessage: "Subcategory selection is invalid if provided",
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
