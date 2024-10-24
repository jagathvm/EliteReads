import {
  generateAccessToken,
  setCookie,
  hashPassword,
  verifyPassword,
} from "../services/authServices.js";
import { sendOTP, verifyOTP } from "../services/otpServices.js";
import { sendResponse, renderResponse } from "../utils/responseHandler.js";
import { addUser, getAdmin, getUser } from "../services/dbServices.js";

const getAdminLogin = (req, res) =>
  renderResponse(res, 200, "admin/admin-login", { req });

const getUserLogin = (req, res) =>
  renderResponse(res, 200, "user/user-login", { req });

const getUserLoginVerification = (req, res) =>
  renderResponse(res, 200, "user/user-login-verify", { req });

const getUserSignup = (req, res) =>
  renderResponse(res, 200, "user/user-signup", { req });

const postAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.validData;
    const { found: adminFound, value: admin } = await getAdmin({ email });

    // Send error response if admin is not found
    if (!adminFound)
      return sendResponse(res, 404, "Invalid Admin Name / Password", false);

    const passwordsMatch = await verifyPassword(password, admin.password);

    // Send error response if password is not matched
    if (!passwordsMatch)
      return sendResponse(res, 400, "Invalid Admin Name / Password", false);

    setCookie(res, "accessToken", generateAccessToken({ id: admin._id }));

    return sendResponse(res, 200, "Admin Logged In.", true);
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      500,
      "An unexpected error occurred. Please try again later.",
      false
    );
  }
};

const postUserSignup = async (req, res) => {
  try {
    const { email, phone, password } = req.validData;
    const { found: userExists } = await getUser({
      $or: [{ email }, { phone }],
    });

    if (userExists)
      return sendResponse(
        res,
        409,
        "A user with this email or phone number already exists.",
        false
      );

    const hashedPassword = await hashPassword(password);

    const { acknowledged, insertedId } = await addUser({
      email,
      phone,
      password: hashedPassword,
    });

    if (!acknowledged)
      return sendResponse(res, 400, "User registration failed.", false);

    setCookie(res, "accessToken", generateAccessToken({ id: insertedId }));

    return sendResponse(res, 201, "User registration successful", true);
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      "An unexpected error occurred. Please try again later.",
      false
    );
  }
};

const postUserLogin = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.validData;

    const { found: userFound, value: user } = await getUser({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!userFound)
      return sendResponse(res, 404, "Invalid Username / Password", false);

    const passwordsMatch = await verifyPassword(password, user.password);
    if (!passwordsMatch)
      return sendResponse(res, 400, "Invalid Username / Password", false);

    const otpResponse = await sendOTP(user.phone);
    if (!otpResponse || otpResponse.status !== "pending") {
      return sendResponse(
        res,
        500,
        "Failed to send otp. Please try again later.",
        false
      );
    }

    setCookie(res, "phone", user.phone, 10 * 60 * 1000);

    return sendResponse(res, 200, "OTP sent to your phone.", true);
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      "An unexpected error occurred. Please try again later.",
      false
    );
  }
};

const postVerifyOtp = async (req, res) => {
  try {
    const otpVerification = await verifyOTP(req.cookies.phone, req.body.otp);
    if (!otpVerification || otpVerification.status !== "approved")
      return sendResponse(
        res,
        400,
        "OTP verification failed. Please try again.",
        false
      );

    const {
      found: userFound,
      value: user,
      errorMessage: userNotFound,
    } = await getUser({ phone: req.cookies.phone });
    if (!userFound) return sendResponse(res, 404, userNotFound, false);

    setCookie(res, "accessToken", generateAccessToken({ userId: user._id }));
    res.clearCookie("phone");

    return sendResponse(res, 200, "Login Successful.", true);
  } catch (error) {
    console.error(`An error occurred. Please Try Again Later. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

export {
  getAdminLogin,
  getUserLogin,
  getUserLoginVerification,
  getUserSignup,
  postAdminLogin,
  postUserSignup,
  postUserLogin,
  postVerifyOtp,
};
