import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const deleteSubcategoryButton = document.getElementById(
  "deleteSubcategoryButton"
);

deleteSubcategoryButton.addEventListener("click", async (e) => {
  const subCategorySlug = deleteSubcategoryButton.getAttribute(
    "data-subcategory-slug"
  );
  const parentCategorySlug = deleteSubcategoryButton.getAttribute(
    "data-parentcategory-slug"
  );

  try {
    const apiClient = new HttpRequest(
      `/admin/categories/${parentCategorySlug}`
    );
    const response = await apiClient.delete(`/${subCategorySlug}`);

    if (response.status === 204) {
      showToast("Subcategory Deleted.", true);
      setTimeout(() => {
        window.location.href = `/admin/categories/${parentCategorySlug}`;
      }, 2000);
    } else {
      showToast(response.message, false);
    }
  } catch (error) {
    showToast(errorMessage, false);
    throw new Error(`An Unexpected error occurred. ${error}`);
  }
});
