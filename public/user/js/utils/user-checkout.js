import HttpRequest from "../../../helpers/http-request.js";
import { userAddressValidator } from "../validators/user-address-validator.js";
import { showToast } from "../../../helpers/toast.js";
import {
  handleInstantRedirect,
  handleRedirect,
} from "../../../helpers/handleUrl.js";

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
      handleRedirect("/cart/checkout");
    }
  } catch (error) {
    console.error(error);
  }
});

placeOrderBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Hide the button to prevent multiple clicks
  placeOrderBtn.style.display = "none";

  // Get the selected address
  const selectedAddress = document.querySelector(
    'input[name="selected_address"]:checked'
  )?.value;

  const totalPrice = parseInt(
    document.querySelector(".cart_total_amount span").textContent.trim(),
    10
  );

  if (!selectedAddress)
    return showToast(
      "Please select a shipping address.",
      false,
      "center",
      "bottom"
    );

  // Get the selected payment method
  const paymentMethod = document.querySelector(
    'input[name="payment_option"]:checked'
  )?.value;

  // Convert paymentMethod to number
  const paymentMethodId = Number(paymentMethod);

  if (isNaN(paymentMethodId))
    return showToast(
      "Please select a payment method.",
      false,
      "center",
      "bottom"
    );

  const dataObj = { selectedAddress, paymentMethodId, totalPrice };

  try {
    const apiClient = new HttpRequest("/cart");
    const {
      success,
      message,
      data: { orderId, amount },
    } = await apiClient.post("/create-order", dataObj);

    if (!success) {
      return showToast(message, false, "center", "bottom");
    }

    if (paymentMethodId === 1) {
      try {
        // Step 1: Create Razorpay order from backend
        const {
          success,
          data: { razorpayOrder, name, email, RAZORPAY_KEY_ID },
        } = await apiClient.post("/create-razorpay-order", { amount });

        if (!success || !razorpayOrder)
          showToast(
            "Unable to process Razorpay order.",
            false,
            "center",
            "bottom"
          );

        // Step 2: Configure Razorpay Checkout options
        const options = {
          key: RAZORPAY_KEY_ID, // Razorpay Public Key
          amount: razorpayOrder.amount, // in paise
          currency: "INR",
          name: "EliteReads",
          order_id: razorpayOrder.id, // Razorpay order_id from backend
          prefill: {
            name,
            email,
          },
          theme: {
            color: "#5b8def",
          },
          handler: async function (response) {
            const { success, message } = await apiClient.post(
              "/verify-razorpay-payment",
              { ...response, orderId }
            );

            showToast(message, success, "center", "bottom");

            if (!success) {
              return;
            }

            return handleInstantRedirect("/profile/orders");
          },
          modal: {
            ondismiss: async function () {
              // Razorpay checkout closed by user
              const { success, message } = await apiClient.post(
                "/mark-razorpay-payment-failed",
                {
                  orderId,
                  razorpay_order_id: razorpayOrder.id,
                }
              );

              showToast(message, !success, "center", "bottom");
              return handleRedirect("/profile/orders");
            },
          },
        };

        // Step 3: Open Razorpay Checkout
        const rzp = new Razorpay(options);
        rzp.open();

        return;
      } catch (error) {
        console.error("Error initiating Razorpay payment: ", error);
        return showToast(
          "Something went wrong. Please try again.",
          false,
          "center",
          "bottom"
        );
      }
    }

    if (paymentMethodId === 2) {
      const paypalBtnContainer = document.getElementById(
        "paypal-button-container"
      );
      if (paypalBtnContainer) paypalBtnContainer.innerHTML = "";

      // Render PayPal Buttons
      paypal
        .Buttons({
          // 1. Create PayPal Order
          createOrder: async function () {
            try {
              const {
                success,
                data: { orderID },
              } = await apiClient.post("/create-paypal-order", {
                orderId,
                totalPrice,
              });

              if (success && orderID) {
                return orderID;
              }
            } catch (error) {
              console.error("PayPal Order Creation Error:", error);
              showToast(
                "Unable to initiate PayPal payment.",
                false,
                "center",
                "bottom"
              );
            }
          },

          // 2. Capture Order
          onApprove: async function ({ orderID, payerID }) {
            try {
              const { success, message } = await apiClient.post(
                "/capture-paypal-order",
                {
                  orderId,
                  orderID,
                  payerID,
                }
              );

              showToast(message, success, "center", "bottom");
              if (success) {
                handleRedirect("/profile/orders");
              }
            } catch (error) {
              console.error("Error capturing PayPal order:", error);
              showToast(
                "Failed to capture PayPal payment.",
                false,
                "center",
                "bottom"
              );
            }
          },

          // 3. Handle Cancel
          onCancel: async function ({ orderID }) {
            try {
              const { success, message } = await apiClient.post(
                "/mark-paypal-payment-failed",
                {
                  orderId,
                  orderID,
                }
              );

              showToast(message, !success, "center", "bottom");
              return handleRedirect("/profile/orders");
            } catch (error) {
              console.error("Error marking payment as failed:", error);
              showToast(
                "Something went wrong. Please try again.",
                false,
                "center",
                "bottom"
              );
            }
          },

          // Optional: Customize PayPal button style
          style: {
            layout: "vertical",
            color: "gold",
            shape: "pill",
            label: "paypal",
          },
        })
        .render("#paypal-button-container");
      return;
    }

    showToast(message, success, "center", "bottom");

    if (success) return handleRedirect("/profile/orders");
  } catch (error) {
    console.error("Error placing order: ", error);
    throw error;
  }
});
