import HttpRequest from "../../../helpers/http-request.js";
import { editCategoryValidator } from "../validators/admin-edit-category-validator.js";
import { showToast } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const deleteCategoryButton = document.getElementById("deleteCategoryButton");
const editCategoryForm = document.getElementById("editCategoryForm");
const saveCategoryButton = document.getElementById("saveCategoryButton");

// Capture the original form data to compare later
const originalData = {
  name: document.getElementById("edit_category_name").value,
  description: document.getElementById("edit_category_description").value,
  parentCategory: document.getElementById("edit_category_parent").value,
};

saveCategoryButton.addEventListener("click", async (e) => {
  // Get current form data
  const currentData = {
    name: document.getElementById("edit_category_name").value,
    description: document.getElementById("edit_category_description").value,
    parentCategory: document.getElementById("edit_category_parent").value,
  };

  // Identify changed fields
  const changedData = {};
  Object.keys(currentData).forEach((key) => {
    if (currentData[key] !== originalData[key]) {
      changedData[key] = currentData[key];
    }
  });

  // If no fields were changed, show a toast and exit
  if (Object.keys(changedData).length === 0) {
    return showToast("Please modify the fields before submitting.", false);
  }

  // Perform validation
  const isValid = await editCategoryValidator.revalidate();
  if (!isValid) {
    return showToast("Kindly fill in all fields to continue.", false);
  }

  const slug = saveCategoryButton.getAttribute("data-category-slug");

  try {
    const apiClient = new HttpRequest("/admin/categories");
    const {
      success,
      message,
      data: responseData,
    } = await apiClient.patch(`/${slug}`, changedData);

    if (!success) return showToast(message, false);
    showToast(message, true);
    handleRedirect(
      responseData
        ? `/admin/categories/${responseData}`
        : `/admin/categories/${slug}`
    );
  } catch (error) {
    showToast(error.message, false);
    throw new Error(`An Unexpected Error Occurred: ${error}`);
  }
});

deleteCategoryButton.addEventListener("click", async (e) => {
  const slug = deleteCategoryButton.getAttribute("data-category-slug");

  try {
    const apiClient = new HttpRequest("/admin/categories");
    const { status, message } = await apiClient.delete(`/${slug}`);

    if (status !== 204) return showToast(message, false);
    showToast("Category Deleted.", true);
    handleRedirect("/admin/categories");
  } catch (error) {
    console.error(error);
    showToast(error.message, false);
  }
});
