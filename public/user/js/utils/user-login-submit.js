import HttpRequest from "../../../helpers/http-request.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const postUserLoginForm = document.getElementById("formLogIn");

postUserLoginForm.addEventListener("submit", async (e) => {
  const formData = new FormData(postUserLoginForm);
  formData.checkbox = formData.checkbox === "on";

  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/login", formData);

    if (response.success) {
      showToast(response.message, true);

      // Delay the redirection to give time for the toast to be visible
      setTimeout(() => {
        window.location.href = "/api/auth/loginVerification";
      }, 2000); // 2 seconds delay
    } else {
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    console.error(`Error during login: `, error);
    showToast(error.message || errorMessage, false);
  }
});
