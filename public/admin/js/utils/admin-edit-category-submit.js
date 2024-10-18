import HttpRequest from "../../../helpers/http-request.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";

const editCategoryForm = document.getElementById("editCategoryForm");
const saveCategoryButton = document.getElementById("saveCategoryButton");

saveCategoryButton.addEventListener("click", async (e) => {
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
