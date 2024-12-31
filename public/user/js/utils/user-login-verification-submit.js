import HttpRequest from "../../../helpers/http-request.js";
import { userOtpValidator } from "../validators/user-otp-validator.js";
import { showToast } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";

const formOtp = document.getElementById("formOtp");
const otpErrorMessage = document.getElementById("otpErrorMessage");

formOtp.addEventListener("submit", async (e) => {
  const isValid = await userOtpValidator.revalidate();
  if (!isValid) return e.preventDefault();

  const formData = new FormData(formOtp);
  const data = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/api/auth");
    const { success, message } = await apiClient.post(
      "/loginVerification",
      data
    );

    const changeStyle = (style) => {
      otpErrorMessage.style.display = style;
    };
    if (!success) {
      changeStyle("block");
      setTimeout(() => {
        changeStyle("none");
      }, 3000);
      return;
    }

    showToast(message, true, "center");
    handleRedirect("/");
  } catch (error) {
    showToast(error.message, false);
  }
});
