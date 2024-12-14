import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const deleteCategoryButton = document.getElementById("deleteCategoryButton");

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
    showToast(errorMessage, false);
  }
});
