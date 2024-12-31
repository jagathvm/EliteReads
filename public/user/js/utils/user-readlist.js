import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";
const readlistButtons = document.querySelectorAll(".readlistAction");

readlistButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const bookId = button.getAttribute("data-book-id");
    const tableRow = button.closest("tr"); // Dynamically targets the row containing this button
    const data = { bookId };

    try {
      const apiClient = new HttpRequest("/");
      const { success, message } = await apiClient.post("readlist", data);

      if (!success) tableRow.setAttribute("hidden", true);
      return showToast(message, success ? true : false, "center", "bottom");
    } catch (error) {
      console.error(`Error adding to/removing from readlist`);
      showToast(
        "An unexpected error occurred. Please try again.",
        false,
        "center",
        "top"
      );
      throw error;
    }
  });
});
