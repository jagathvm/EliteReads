import HttpRequest from "../../../helpers/http-request.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";
import { editCategoryValidator } from "../validators/admin-edit-category-validator.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

// Capture the original form data to compare later
const originalData = {
  name: document.getElementById("edit_category_name").value,
  description: document.getElementById("edit_category_description").value,
  parentCategory: document.getElementById("edit_category_parent").value,
};

const editCategoryForm = document.getElementById("editCategoryForm");
const saveCategoryButton = document.getElementById("saveCategoryButton");

saveCategoryButton.addEventListener("click", async (e) => {
  // Get current form data
  const currentData = {
    name: document.getElementById("edit_category_name").value,
    description: document.getElementById("edit_category_description").value,
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
  const data = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/admin/categories");
    const {
      success,
      message,
      data: responseData,
    } = await apiClient.patch(`/${slug}`, data);

    if (!success) return showToast(message, false);
    showToast(message, true);
    handleRedirect(
      responseData ? `/admin/categories/${responseData}` : "/admin/categories"
    );
  } catch (error) {
    showToast(errorMessage, false);
    throw new Error(`An Unexpected Error Occurred: ${error}`);
  }
});
