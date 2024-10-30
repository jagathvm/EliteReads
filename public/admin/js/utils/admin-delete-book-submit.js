import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const confirmDeleteButton = document.getElementById("confirmDeleteButton");

confirmDeleteButton.addEventListener("click", async (e) => {
  const bookSlug = confirmDeleteButton.getAttribute("data-book-bookSlug");

  try {
    const apiClient = new HttpRequest("/admin/books");
    const response = await apiClient.delete(`/${bookSlug}`);

    if (response.status === 204) {
      showToast("Book Removed.", true);
      setTimeout(() => {
        window.location.href = "/admin/books";
      }, 2000);
    } else {
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    console.error(error);
    showToast(errorMessage, false);
  }
});
