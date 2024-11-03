import HttpRequest from "../../../helpers/http-request.js";
import { userLoginValidator } from "../validators/user-login-validator.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const formOtp = document.getElementById("formOtp");
const otpErrorMessage = document.getElementById("otpErrorMessage");

formOtp.addEventListener("submit", async (e) => {
  const isValid = await userLoginValidator.revalidate();
  if (!isValid) return e.preventDefault();

  const formData = new FormData(formOtp);

  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/loginVerification", formData);

    if (response.success) {
      showToast(response.message, true, "center");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      otpErrorMessage.style.display = "block";
      setTimeout(() => {
        otpErrorMessage.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    showToast(errorMessage, false);
  }
});
