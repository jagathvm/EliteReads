import HttpRequest from "../../../helpers/http-request.js";
import { userSignupValidator } from "../validators/user-signup-validator.js";
import { showToast } from "../../../helpers/toast.js";
import { handleRedirect } from "../../../helpers/handleUrl.js";
const postUserSignUpForm = document.getElementById("formSignUp");

postUserSignUpForm.addEventListener("submit", async (e) => {
  const isValid = await userSignupValidator.revalidate();
  if (!isValid) return;

  const formData = new FormData(postUserSignUpForm);
  const data = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/api/auth");
    const { success, message } = await apiClient.post("/signup", data);

    showToast(message, success ? true : false);
    if (success) {
      handleRedirect("/");
    }
  } catch (error) {
    showToast(error.message, false);
    console.error(`Error during signup: `, error);
  }
});
