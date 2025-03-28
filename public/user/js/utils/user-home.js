import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";

const readlistButtons = document.querySelectorAll(".button-readlist");
const readlistCountElement = document.querySelector(".readlist-count");

const updateReadlistCount = (success) => {
  // Safely update the count
  const currentCount = parseInt(readlistCountElement.textContent, 10);
  if (currentCount > 0) {
    readlistCountElement.textContent = success
      ? currentCount + 1
      : currentCount - 1;
  }
};

const heartIconAction = (button, success) => {
  const heartIcon = button?.querySelector("i");

  heartIcon?.classList.toggle("bi-heart-fill", success);
  heartIcon?.classList.toggle("bi-heart", !success);
};

const readlistAction = async (e) => {
  // Use `currentTarget` to refer to the button
  const button = e.currentTarget;
  const bookId = button.getAttribute("data-book-id");
  const data = { bookId };

  try {
    const apiClient = new HttpRequest("/");
    const { success, message } = await apiClient.post("readlist", data);

    heartIconAction(button, success);
    updateReadlistCount(success);
    return showToast(message, success, "center", "bottom");
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
};

readlistButtons.forEach((button) => {
  button.addEventListener("click", readlistAction);
});
