import HttpRequest from "../../../helpers/http-request.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";
import { editCategoryValidator } from "../validators/admin-edit-category-validator.js";

// Capture the original form data to compare later
const originalData = {
  name: document.getElementById("edit_category_name").value,
  description: document.getElementById("edit_category_description").value,
  slug: document.getElementById("edit_category_slug").value,
  parentCategory: document.getElementById("edit_category_parent").value,
};

const editCategoryForm = document.getElementById("editCategoryForm");
const saveCategoryButton = document.getElementById("saveCategoryButton");

saveCategoryButton.addEventListener("click", async (e) => {
  // Get current form data
  const currentData = {
    name: document.getElementById("edit_category_name").value,
    description: document.getElementById("edit_category_description").value,
    slug: document.getElementById("edit_category_slug").value,
    parentCategory: document.getElementById("edit_category_parent").value,
  };

  // Check if any data has changed
  const isUnchanged = Object.keys(originalData).every(
    (key) => originalData[key] === currentData[key]
  );
  if (isUnchanged)
    return showToast("Please modify the fields before submitting.", false);

  const isValid = await editCategoryValidator.revalidate();
  if (!isValid)
    return showToast("Kindly fill in all fields to continue.", false);

  const slug = saveCategoryButton.getAttribute("data-category-slug");
  const formData = new FormData(editCategoryForm);
  try {
    const apiClient = new HttpRequest("/admin/categories");
    const response = await apiClient.patch(`/${slug}`, formData);

    if (response.success) {
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = `/admin/categories`;
      }, 2000);
    } else {
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    showToast(errorMessage, false);
    throw new Error(`An Unexpected Error Occurred: ${error}`);
  }
});
