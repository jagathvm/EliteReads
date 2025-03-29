import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";

const cartCountElement = document.querySelector(".cart-count");
const quantityContainers = document.querySelectorAll(".detail-qty");
const trashButtonContainers = document.querySelectorAll(".trashContainer");
const cartSubTotalElement = document.querySelector(
  ".cart_sub_total_amount span"
);
const cartTotalElement = document.querySelector(
  ".cart_total_amount strong span"
);

const updateCartTotals = () => {
  let totalPrice = 0;

  // Re-fetch the subTotal elements to ensure only existing elements are considered
  const subTotalElements = document.querySelectorAll(".subTotal span");

  if (!subTotalElements || !cartSubTotalElement || !cartTotalElement) return;

  subTotalElements.forEach((subTotalElement) => {
    const subTotalValue = parseFloat(subTotalElement.textContent, 10);
    totalPrice += subTotalValue;
  });

  // Update subtotal and total fields
  cartSubTotalElement.textContent = Number.isInteger(totalPrice)
    ? totalPrice
    : totalPrice.toFixed(2);
  cartTotalElement.textContent = Number.isInteger(totalPrice)
    ? totalPrice
    : totalPrice.toFixed(2);
};

const updateCartCount = () => {
  // Safely update the count
  const currentCount = parseInt(cartCountElement.textContent, 10);
  cartCountElement.textContent = currentCount - 1;
};

const checkIfCartIsEmpty = () => {
  const remainingRows = document.querySelectorAll(".shopping-summery tbody tr");
  if (remainingRows.length === 1) {
    // The last row is the "Clear Cart" button, so check for more than one row
    document.querySelector(".table-responsive")?.remove();
    document.querySelector(".cart-totals")?.remove();
    document.querySelector(".divider")?.remove();
    document.querySelector(".row.mb-50")?.remove();

    // Select the empty cart message container
    const emptyCartElement = document.querySelector(".empty-cart");

    // Ensure the empty cart element exists before displaying it
    if (emptyCartElement) {
      emptyCartElement.removeAttribute("hidden");
    } else {
      console.warn("Empty cart element not found in DOM.");
    }
  }
};

updateCartTotals();
quantityContainers.forEach((quantityContainer) => {
  const qtyUp = quantityContainer.querySelector(".qty-up");
  const qtyDown = quantityContainer.querySelector(".qty-down");
  const bookId = quantityContainer.getAttribute("data-book-id");

  const updateQuantityValue = async (increment) => {
    // Dynamically fetch elements for the current row
    const rowElement = quantityContainer.closest("tr");
    const priceValue = parseInt(
      rowElement.querySelector(".price span").textContent,
      10
    );
    const quantityValElement = rowElement.querySelector(".qty-val");
    const subTotalValElement = rowElement.querySelector(".subTotal span");

    // Send API request to update backend
    const data = { bookId, quantityIncrement: increment };

    try {
      const apiClient = new HttpRequest("/cart");
      const {
        data: { cartQuantity },
        message,
        success,
      } = await apiClient.put("/quantity-update", data);

      // Update DOM
      quantityValElement.textContent = cartQuantity;
      subTotalValElement.textContent = cartQuantity * priceValue;
      updateCartTotals();

      if (!success) showToast(message, success, "center", "center");
      return;
    } catch (error) {
      console.error("Error incrementing/decrementing quantity: ", error);
      throw error;
    }
  };

  qtyUp.addEventListener("click", () => updateQuantityValue(true));
  qtyDown.addEventListener("click", () => updateQuantityValue(false));
});

trashButtonContainers.forEach((trashButtonContainer) => {
  const trashButton = trashButtonContainer.querySelector(".text-muted i");

  const trashButtonAction = async () => {
    const bookId = trashButton.getAttribute("data-book-id");

    try {
      const apiClient = new HttpRequest("/cart");
      const { success, message } = await apiClient.put("/remove", {
        bookId,
      });

      if (success) {
        // Update DOM
        const rowElement = trashButton.closest("tr");
        rowElement.remove();

        updateCartCount();

        updateCartTotals();

        checkIfCartIsEmpty();
      }

      return showToast(message, false, "center", "bottom");
    } catch (error) {
      console.error("Error removing book from cart: ", error);
      throw error;
    }
  };

  trashButton.addEventListener("click", trashButtonAction);
});
