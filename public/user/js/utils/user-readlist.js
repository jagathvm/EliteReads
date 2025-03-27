import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";

const readlistButtons = document.querySelectorAll(".readlistAction");
const addToCartButtons = document.querySelectorAll(".button-add-to-cart");
const goToCartButtons = document.querySelectorAll(".button-go-to-cart");
const readlistCountElement = document.querySelector(".readlist-count");
const cartCountElement = document.querySelector(".cart-count");

const checkIfReadlistIsEmpty = () => {
  const remainingRows = document.querySelectorAll(".shopping-summery tbody tr");

  if (remainingRows.length === 0) {
    // Remove the table container
    document.querySelector(".table-responsive")?.remove();

    // Select the empty readlist message container
    const emptyReadlistElement = document.querySelector(".empty-readlist");

    // Ensure the empty readlist element exists before modifying it
    if (emptyReadlistElement) {
      emptyReadlistElement.removeAttribute("hidden"); // Remove the 'hidden' attribute
    } else {
      console.warn("Empty readlist element not found in DOM.");
    }
  }
};

const updateReadlistCount = () => {
  // Safely update the count
  const currentCount = parseInt(readlistCountElement.textContent, 10);
  if (currentCount > 0) {
    readlistCountElement.textContent = currentCount - 1;
  }
};

const updateCartCount = () => {
  // Safely update the count
  const currentCount = parseInt(cartCountElement.textContent, 10);
  cartCountElement.textContent = currentCount + 1;
};

const readlistAction = async (e) => {
  e.preventDefault();
  const button = e.currentTarget;
  const bookId = button.getAttribute("data-book-id");
  const data = { bookId };

  try {
    const apiClient = new HttpRequest("/");
    const {
      message,
      data: { heart },
    } = await apiClient.post("readlist", data);

    if (!heart) {
      button.closest("tr").remove();
      updateReadlistCount();
      checkIfReadlistIsEmpty();
    }
    return showToast(message, heart, "center", "bottom");
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

const addToCartAction = async (e) => {
  // The clicked "Add to Cart" button
  const button = e.currentTarget;
  // Find the table row
  const rowElement = button.closest("tr");
  // Fetch bookId correctly from the hidden input field
  const bookId = rowElement.querySelector("input[type='hidden']").value;
  const data = { bookId };
  // Locate the corresponding "Go to Cart" button
  const goToCartButton = rowElement.querySelector(".button-go-to-cart");

  try {
    const apiClient = new HttpRequest("/");
    const { success, message } = await apiClient.post("cart", data);

    if (success) {
      // Hide Add to Cart button
      button.hidden = true;

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

readlistButtons.forEach((button) => {
  button.addEventListener("click", readlistAction);
});

addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCartAction);
});

goToCartButtons.forEach((button) => {
  button.addEventListener("click", goToCartAction);
});
