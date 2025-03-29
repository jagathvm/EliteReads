import HttpRequest from "../../../helpers/http-request.js";
import { userAddressValidator } from "../validators/user-address-validator.js";
import { showToast } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const postUserAddressForm = document.getElementById("postUserAddressForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

postUserAddressForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const isValid = await userAddressValidator.revalidate();
  if (!isValid)
    return showToast("Kindly fill in all fields to continue.", false, "center");

  const formData = new FormData(postUserAddressForm);
  const rawData = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/profile");
    const { message, success } = await apiClient.post("/address", rawData);

    const toastMessage = Array.isArray(message) ? message[0] : message;
    showToast(toastMessage, success, "center");

    if (success) {
      handleRedirect("/checkout");
    }
  } catch (error) {
    console.error(error);
  }
});

placeOrderBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Get the selected address
  const selectedAddress = document.querySelector(
    'input[name="selected_address"]:checked'
  )?.value;

  if (!selectedAddress) {
    showToast("Please select a shipping address.", false, "center", "bottom");
    return;
  }

  // Get the selected payment method
  const paymentMethod = document.querySelector(
    'input[name="payment_option"]:checked'
  )?.value;

  if (!paymentMethod) {
    return showToast(
      "Please select a payment method.",
      false,
      "center",
      "bottom"
    );
  }

  // Restrict to COD only
  if (paymentMethod === "upi") {
    return showToast(
      "UPI payment is currently unavailable. Please choose Cash on Delivery.",
      false,
      "center",
      "bottom"
    );
  }

  const data = { selectedAddress, paymentMethod };

  try {
    const apiClient = new HttpRequest("/cart");
    const { success, message } = await apiClient.post("/place-order", data);

    showToast(message, success, "center", "bottom");

    if (success) return handleRedirect("/profile/orders");
  } catch (error) {
    console.error("Error placing order: ", error);
    throw error;
  }
});
