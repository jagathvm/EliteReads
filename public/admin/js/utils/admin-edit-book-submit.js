import HttpRequest from "../../../helpers/http-request.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";

const editBookForm = document.getElementById("editBookForm");
const saveBookButton = document.getElementById("saveBookButton");
const categorySelect = document.getElementById("editCategory");
const subcategorySelect = document.getElementById("editSubcategory");

saveBookButton.addEventListener("click", async (e) => {
  const slugWithIsbn = editBookForm.getAttribute("data-book-slugWithIsbn");
  const formData = new FormData(editBookForm);
  try {
    const apiClient = new HttpRequest("/admin/books");
    const response = await apiClient.patch(`/${slugWithIsbn}`, formData);

    if (response.success) {
      const slugWithIsbn = response.data
        ? response.data
        : editBookForm.getAttribute("data-book-slugWithIsbn");
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = `/admin/books/${slugWithIsbn}`;
      }, 2000);
    } else {
      showToast(response.message || response.error || errorMessage, false);
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
      option.value = subcategory.name;
      option.textContent = subcategory.name;
      subcategorySelect.appendChild(option);
    });
  }
});
