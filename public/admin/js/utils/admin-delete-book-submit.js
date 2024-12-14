import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const confirmDeleteButton = document.getElementById("confirmDeleteButton");

confirmDeleteButton.addEventListener("click", async (e) => {
  const bookSlug = confirmDeleteButton.getAttribute("data-book-bookSlug");

  try {
    const apiClient = new HttpRequest("/admin/books");
    const { status, message } = await apiClient.delete(`/${bookSlug}`);

    if (status !== 204) return showToast(message, false);
    showToast("Book Removed.", true);
    handleRedirect("/admin/books");
  } catch (error) {
    console.error(error);
    showToast(errorMessage, false);
  }
});
