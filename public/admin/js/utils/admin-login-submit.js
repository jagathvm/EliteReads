import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const postAdminLoginForm = document.getElementById("formLogIn");

postAdminLoginForm.addEventListener("submit", async (e) => {
  const formData = new FormData(postAdminLoginForm);

  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/adminLogin", formData);

    if (response.success) {
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000); // 2 seconds delay
    } else {
      console.log(response.message);
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    console.error(`Error during login: ${error}`);
    showToast(errorMessage, false);
  }
});
