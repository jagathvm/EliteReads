import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";
import { handleReload } from "../../../helpers/handleUrl.js";

const blockUnblockForm = document.getElementById("blockUnblockForm");

blockUnblockForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = blockUnblockForm.getAttribute("data-username");
  const formData = new FormData(blockUnblockForm);
  const data = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/admin/user-profile");
    const { success, message } = await apiClient.patch(`/${username}`, data);

    if (!success) return showToast(message, false);
    showToast(message, true, "center", "top");
    handleReload();
  } catch (error) {
    console.error(error);
    showToast(error.message, false);
  }
});
