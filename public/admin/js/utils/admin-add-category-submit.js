import HttpRequest from "../../../helpers/http-request.js";
import { addCategoryValidator } from "../validators/admin-add-category-validator.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const addCategoryForm = document.getElementById("addCategoryForm");
const saveCategoryButton = document.getElementById("saveCategoryButton");

saveCategoryButton.addEventListener("click", async (e) => {
  const isValid = await addCategoryValidator.revalidate();
  if (!isValid) {
    return showToast("Kindly fill in all fields to continue.", false);
  }

  const formData = new FormData(addCategoryForm);
  try {
    const apiClient = new HttpRequest("/admin/categories");
    const response = await apiClient.post("/add-category", formData);

    if (response.success) {
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = "/admin/categories";
      }, 2000);
    } else {
      showToast(response.message, false);
    }
  } catch (error) {
    console.error(error);
    showToast(error.message || errorMessage, false);
  }
});
