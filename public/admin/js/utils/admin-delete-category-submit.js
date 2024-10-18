import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const deleteCategoryButton = document.getElementById("deleteCategoryButton");

deleteCategoryButton.addEventListener("click", async (e) => {
  const slug = deleteCategoryButton.getAttribute("data-category-slug");
  try {
    const apiClient = new HttpRequest("/admin/categories");
    const response = await apiClient.delete(`/${slug}`);

    if (response.status === 204) {
      showToast("Category Deleted.", true);
      setTimeout(() => {
        window.location.href = "/admin/categories";
      }, 2000);
    } else {
      showToast(response.message, false);
    }
  } catch (error) {
    console.error(error);
    showToast(errorMessage, false);
  }
});
