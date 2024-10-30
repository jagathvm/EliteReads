import HttpRequest from "../../../helpers/http-request.js";
import { editBookValidator } from "../validators/admin-edit-book-validator.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";

const editBookForm = document.getElementById("editBookForm");
const saveBookButton = document.getElementById("saveBookButton");
const categorySelect = document.getElementById("editCategory");
const subcategorySelect = document.getElementById("editSubcategory");

const originalData = {
  cover_image: document.getElementById("editCoverImage").value,
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
    cover_image: document.getElementById("editCoverImage").value,
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

  const isUnchanged = Object.keys(originalData).every(
    (key) => originalData[key] === currentData[key]
  );
  if (isUnchanged)
    return showToast("Please modify the fields before submitting.", false);

  const isValid = await editBookValidator.revalidate();
  if (!isValid)
    return showToast(
      "Please review the form and correct any errors before submitting.",
      false
    );

  const bookSlug = editBookForm.getAttribute("data-book-bookSlug");
  const formData = new FormData(editBookForm);

  try {
    const apiClient = new HttpRequest("/admin/books");
    const response = await apiClient.patch(`/${bookSlug}`, formData);
    if (response.success) {
      const slug = response.data ? response.data : bookSlug;
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = `/admin/books/${slug}`;
      }, 2000);
    } else {
      return showToast(
        response.message || response.error || errorMessage,
        false
      );
    }
  } catch (error) {
    console.error(error);
    showToast(response.message || response.error || errorMessage, false);
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
