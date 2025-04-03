import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";
import { handleReload } from "../../../helpers/handleUrl.js";

const updateOrderStatus = document.getElementById("updateOrderStatus");
const orderId = updateOrderStatus.getAttribute("data-bs-orderId");

updateOrderStatus.addEventListener("click", async () => {
  const orderStatusId = document.getElementById("orderStatus").value;
  const data = { orderStatusId, orderId };

  try {
    const apiClient = new HttpRequest("/admin");
    const { success, message } = await apiClient.post(
      `/order-details/${orderId}`,
      data
    );

    showToast(message, success, "center", "top");

    if (success) handleReload();

    return;
  } catch (error) {
    console.error("An unexpected error occurred. Please try again later.");
    throw error;
  }
});
