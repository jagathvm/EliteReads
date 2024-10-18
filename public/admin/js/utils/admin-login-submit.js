import HttpRequest from "../../../helpers/http-request.js";
import { adminLoginValidator } from "../validators/admin-login-validator.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const postAdminLoginForm = document.getElementById("formLogIn");
const invalidCredentialsMessage = document.getElementById(
  "invalidCredentialsMessage"
);

postAdminLoginForm.addEventListener("submit", async (e) => {
  const isValid = await adminLoginValidator.revalidate();
  if (!isValid) {
    return showToast("Kindly fill in all fields to continue.", false);
  }

  const formData = new FormData(postAdminLoginForm);
  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/adminLogin", formData);

    if (response.success) {
      invalidCredentialsMessage.style.display = "hidden";
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000); // 2 seconds delay
    } else {
      invalidCredentialsMessage.style.display = "block";
      setTimeout(() => {
        invalidCredentialsMessage.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    console.error(`Error during login: ${error}`);
    showToast(errorMessage, false);
  }
});
