import HttpRequest from "../../../helpers/http-request.js";
import { errorMessage, showToast } from "../../../helpers/toast.js";
const postUserSignUpForm = document.getElementById("formSignUp");

postUserSignUpForm.addEventListener("submit", async (e) => {
  const formData = new FormData(postUserSignUpForm);

  try {
    const apiClient = new HttpRequest("/api/auth");
    const response = await apiClient.post("/signup", formData);

    if (response.success) {
      showToast(response.message, true);
      setTimeout(() => {
        window.location.href = "/";
        // 2 seconds delay
      }, 2000);
    } else {
      showToast(response.message || response.error, false);
    }
  } catch (error) {
    showToast(errorMessage, false);
    console.error(`Error during signup: `, error);
  }
});
