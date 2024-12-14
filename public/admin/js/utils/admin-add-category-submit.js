import HttpRequest from "../../../helpers/http-request.js";
import { addCategoryValidator } from "../validators/admin-add-category-validator.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const addCategoryForm = document.getElementById("addCategoryForm");
const saveCategoryButton = document.getElementById("saveCategoryButton");

saveCategoryButton.addEventListener("click", async (e) => {
  const isValid = await addCategoryValidator.revalidate();
  if (!isValid)
    return showToast("Kindly fill in all fields to continue.", false);

  const formData = new FormData(addCategoryForm);
  const data = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/admin/categories");
    const { success, message } = await apiClient.post("/add-category", data);

    if (!success) return showToast(message, false);
    showToast(message, true);
    handleRedirect("/admin/categories");
  } catch (error) {
    console.error(error);
    showToast(error.message || errorMessage, false);
  }
});
