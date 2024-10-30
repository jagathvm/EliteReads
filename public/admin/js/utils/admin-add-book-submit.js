import HttpRequest from "../../../helpers/http-request.js";
import { addBookValidator } from "../validators/admin-add-book-validator.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const addBookForm = document.getElementById("addBookForm");
const saveBookButton = document.getElementById("saveBookButton");
const categorySelect = document.getElementById("book_category");
const subcategorySelect = document.getElementById("book_subcategory");

saveBookButton.addEventListener("click", async (e) => {
  const isValid = await addBookValidator.revalidate();
  if (!isValid)
    return showToast("Kindly fill in all fields to continue.", false);

  const formData = new FormData(addBookForm);
  try {
    const apiClient = new HttpRequest("/admin/books");
    const response = await apiClient.post("/add-book", formData);

    if (response.success) {
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = "/admin/books";
      }, 2000);
    } else {
      showToast(response.message || response.error || errorMessage, false);
    }
  } catch (error) {
    console.log(error);
    showToast(error.message || errorMessage, false);
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
