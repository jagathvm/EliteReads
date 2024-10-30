import HttpRequest from "../../../helpers/http-request.js";
import { userSignupValidator } from "../validators/user-signup-validator.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";
const postUserSignUpForm = document.getElementById("formSignUp");

postUserSignUpForm.addEventListener("submit", async (e) => {
  const isValid = await userSignupValidator.revalidate();
  if (!isValid) return;

  const formData = new FormData(postUserSignUpForm);

  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/signup", formData);

    if (response.success) {
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    showToast(errorMessage, false);
    console.error(`Error during signup: `, error);
  }
});
