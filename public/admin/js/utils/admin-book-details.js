import HttpRequest from "../../../helpers/http-request.js";
import {
  editBookDetailsValidator,
  editBookImageValidator,
} from "../validators/admin-edit-book-validator.js";
import { showToast } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const editBookForm = document.getElementById("editBookForm");
const updateCoverImageForm = document.getElementById("updateCoverImageForm");
const saveBookButton = document.getElementById("saveBookButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const saveCoverImageButton = document.getElementById("saveCoverImageButton");
const categorySelect = document.getElementById("editCategory");
const subcategorySelect = document.getElementById("editSubcategory");
const quantityDownButton = document.querySelector(".qty-down");
const quantityUpButton = document.querySelector(".qty-up");
const quantityValue = document.getElementById("quantity-value");

// Disable the decrease button if quantity is 0
quantityDownButton.disabled =
  parseInt(quantityValue.innerText, 10) === 0 ? true : false;

const quantityController = (quantityIncrement) => {
  return async (event) => {
    let currentQuantity = parseInt(quantityValue.textContent, 10);
    const button = event.currentTarget;
    const bookSlug = button.getAttribute("data-bookslug");
    const data = { quantityIncrement, bookSlug };

    try {
      const apiClient = new HttpRequest("/admin/books");
      const { success, data: responseData } = await apiClient.post(
        `/${bookSlug}/quantity`,
        data
      );

      if (!success) return showToast(responseData, false);
      quantityValue.innerText = responseData
        ? currentQuantity + 1
        : currentQuantity - 1;

      // Disable the decrease button if quantity is 0
      quantityDownButton.disabled =
        parseInt(quantityValue.innerText, 10) === 0 ? true : false;

      return;
    } catch (error) {
      console.error(
        "An error occured while decrementing the quantity ",
        error.message
      );
      throw error;
    }
  };
};

const originalData = {
  title: document.getElementById("editTitle").value,
  author: document.getElementById("editAuthor").value,
  description: document.getElementById("editDescription").value,
  price: document.getElementById("editPrice").value,
  isbn: document.getElementById("editISBN").value,
  publisher: document.getElementById("editPublisher").value,
  year: document.getElementById("editYear").value,
  language: document.getElementById("editLanguage").value,
  pages: document.getElementById("editPages").value,
  weight: document.getElementById("editWeight").value,
  category: document.getElementById("editCategory").value,
  subcategory: document.getElementById("editSubcategory").value,
  featured: document.getElementById("editFeatured").value,
};

saveBookButton.addEventListener("click", async (e) => {
  const currentData = {
    title: document.getElementById("editTitle").value,
    author: document.getElementById("editAuthor").value,
    description: document.getElementById("editDescription").value,
    price: document.getElementById("editPrice").value,
    isbn: document.getElementById("editISBN").value,
    publisher: document.getElementById("editPublisher").value,
    year: document.getElementById("editYear").value,
    language: document.getElementById("editLanguage").value,
    pages: document.getElementById("editPages").value,
    weight: document.getElementById("editWeight").value,
    category: document.getElementById("editCategory").value,
    subcategory: document.getElementById("editSubcategory").value,
    featured: document.getElementById("editFeatured").value,
  };

  // Compare currentData with originalData and get only the changed fields
  const changedData = {};
  Object.keys(currentData).forEach((key) => {
    if (originalData[key] !== currentData[key]) {
      changedData[key] = currentData[key];
    }
  });

  // Check if there are any changes; if not, show a toast
  if (Object.keys(changedData).length === 0) {
    return showToast("Please modify the fields before submitting.", false);
  }

  const isValid = await editBookDetailsValidator.revalidate();
  if (!isValid)
    return showToast(
      "Please review the form and correct any errors before submitting.",
      false
    );

  const bookSlug = editBookForm.getAttribute("data-book-bookSlug");
  try {
    const apiClient = new HttpRequest("/admin/books");
    const {
      success,
      message,
      data: responseData,
    } = await apiClient.patch(`/${bookSlug}`, changedData);
    const slug = responseData ? responseData : bookSlug;

    showToast(message, success ? true : false);
    if (success) {
      handleRedirect(`/admin/books/${slug}`);
    }
  } catch (error) {
    console.error(error);
    showToast(error.message, false);
  }
});

saveCoverImageButton.addEventListener("click", async (e) => {
  const isValid = await editBookImageValidator.revalidate();
  if (!isValid) return e.preventDefault();

  const bookSlug = updateCoverImageForm.getAttribute("data-book-bookSlug");
  const formData = new FormData(updateCoverImageForm);
  try {
    const apiClient = new HttpRequest("/admin/books");
    const { success, message, data } = await apiClient.patch(
      `/${bookSlug}/upload`,
      formData
    );

    showToast(message, success ? true : false);
    if (success) {
      const slug = data ? data : bookSlug;
      handleRedirect(`/admin/books/${slug}`);
    }
  } catch (error) {
    console.error(error);
    showToast(error.message, false);
  }
});

categorySelect.addEventListener("change", function () {
  const selectedCategory = categorySelect.options[categorySelect.selectedIndex];

  const subcategories = JSON.parse(
    selectedCategory.getAttribute("data-subcategories")
  );

  // Clear previous subcategories
  subcategorySelect.innerHTML =
    '<option value="" hidden>Select Subcategory</option>';

  // Add new subcategories
  if (subcategories && subcategories.length > 0) {
    subcategories.forEach((subcategory) => {
      const option = document.createElement("option");
      option.value = subcategory._id;
      option.textContent = subcategory.name;
      subcategorySelect.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "None";
    option.disabled = true;
    subcategorySelect.appendChild(option);
  }
});

confirmDeleteButton.addEventListener("click", async (e) => {
  const bookSlug = confirmDeleteButton.getAttribute("data-book-bookSlug");

  try {
    const apiClient = new HttpRequest("/admin/books");
    const { status, message } = await apiClient.delete(`/${bookSlug}`);

    if (status !== 204) return showToast(message, false);
    showToast("Book Removed.", true);
    handleRedirect("/admin/books");
  } catch (error) {
    console.error(error);
    showToast(error.message, false);
  }
});

quantityDownButton.addEventListener("click", quantityController(false));
quantityUpButton.addEventListener("click", quantityController(true));
