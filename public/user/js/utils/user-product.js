import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";
const readListButton = document.querySelector(".readlistAction");

const heartIconAction = (button, success) => {
  const heartIcon = button?.querySelector("i");

  heartIcon?.classList.toggle("bi-heart-fill", success);
  heartIcon?.classList.toggle("bi-heart", !success);
};

const readlistAction = async (e) => {
  const bookId = readListButton.getAttribute("data-book-id");
  const data = { bookId };

  try {
    const apiClient = new HttpRequest("/");
    const { success, message } = await apiClient.post("readlist", data);

    heartIconAction(readListButton, success);
    return showToast(message, success ? true : false, "center", "center");
  } catch (error) {
    console.error(`Error adding to/removing from readlist`);
    throw error;
  }
};

readListButton.addEventListener("click", readlistAction);
