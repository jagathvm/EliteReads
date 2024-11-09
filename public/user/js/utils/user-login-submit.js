import HttpRequest from "../../../helpers/http-request.js";
import { userLoginValidator } from "../validators/user-login-validator.js";
import { showToast, errorMessage } from "../../../helpers/toast.js";

const postUserLoginForm = document.getElementById("formLogIn");
const invalidCredentialsMessage = document.getElementById(
  "invalidCredentialsMessage"
);

postUserLoginForm.addEventListener("submit", async (e) => {
  const isValid = await userLoginValidator.revalidate();
  if (!isValid)
    return showToast("Kindly fill in all fields to continue.", false, "center");

  const formData = new FormData(postUserLoginForm);
  formData.checkbox = formData.checkbox === "on";
  const data = Object.fromEntries(formData);
  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/login", data);

    if (response.success) {
      showToast(response.message, true, "center");

      // Delay the redirection to give time for the toast to be visible
      setTimeout(() => {
        window.location.href = "/api/auth/loginVerification";
      }, 2000); // 2 seconds delay
    } else {
      invalidCredentialsMessage.style.display = "block";
      setTimeout(() => {
        invalidCredentialsMessage.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    console.error(`Error during login: `, error);
    showToast(error.message || errorMessage, false);
  }
});
