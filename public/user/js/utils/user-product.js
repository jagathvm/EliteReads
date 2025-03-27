import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";

const cartCountElement = document.querySelector(".cart-count");
const readlistCountElement = document.querySelector(".readlist-count");

const readListButton = document.querySelector(".button-readlist");
const addToCartButton = document.querySelector(".button-add-to-cart");
const goToCartButton = document.querySelector(".button-go-to-cart");

const bookId = document.getElementById("bookId").value;
const data = { bookId };

const heartIconAction = (button, success) => {
  const heartIcon = button?.querySelector("i");

  heartIcon?.classList.toggle("bi-heart-fill", success);
  heartIcon?.classList.toggle("bi-heart", !success);
};

const updateReadlistCount = (success) => {
  // Safely update the count
  const currentCount = parseInt(readlistCountElement.textContent, 10);
  readlistCountElement.textContent = success
    ? currentCount + 1
    : currentCount - 1;
};

const updateCartCount = () => {
  // Safely update the count
  const currentCount = parseInt(cartCountElement.textContent, 10);
  cartCountElement.textContent = currentCount + 1;
};

const readlistAction = async (e) => {
  try {
    const apiClient = new HttpRequest("/");
    const {
      message,
      data: { heart },
    } = await apiClient.post("readlist", data);

    updateReadlistCount(heart);
    heartIconAction(readListButton, heart);
    return showToast(message, heart, "center", "center");
  } catch (error) {
    console.error(`Error adding to/removing from readlist, ${error}`);
    throw error;
  }
};

const addToCartAction = async (e) => {
  try {
    const apiClient = new HttpRequest("/");
    const { success, message } = await apiClient.post("cart", data);

    if (success) {
      // Hide Add to Cart button
      addToCartButton.hidden = true;

      // Update cart count
      updateCartCount();

      // Show Go to Cart button
      goToCartButton.hidden = false;
    }

    return showToast(message, success, "center", "center");
  } catch (error) {
    console.error(`Error adding to cart: ${error}`);
    throw error;
  }
};

const goToCartAction = async () => {
  window.location.href = "/cart";
};

readListButton.addEventListener("click", readlistAction);
addToCartButton.addEventListener("click", addToCartAction);
goToCartButton.addEventListener("click", goToCartAction);
