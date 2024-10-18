import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const editSubcategoryForm = document.getElementById("editSubcategoryForm");

editSubcategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const subcategorySlug = editSubcategoryForm.getAttribute(
    "data-subCategory-slug"
  );
  const parentCategorySlug = editSubcategoryForm.getAttribute(
    "data-parentcategory-slug"
  );
  const formData = new FormData(editSubcategoryForm);

  try {
    const apiClient = new HttpRequest(
      `/admin/categories/${parentCategorySlug}`
    );
    const response = await apiClient.patch(`/${subcategorySlug}`, formData);

    if (response.success) {
      showToast(response.message, true);
      const url =
        response?.data
          ?.toLowerCase()
          // Remove apostrophes and ampersands
          .replace(/['&]/g, "")
          // Replace spaces with dashes
          .replace(/\s+/g, "-")
          // Handle multiple dashes and return null if data is undefined
          .replace(/-+/g, "-") || null;

      console.log(url);

      setTimeout(() => {
        window.location.href = `/admin/categories/${url}`;
      }, 2000);
    } else {
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    showToast(errorMessage, false);
    throw new Error(`An unexpected error occurred. ${error}`);
  }
});
