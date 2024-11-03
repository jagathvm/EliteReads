import { Router } from "express";
import upload from "../middlewares/upload.js";
import validateData from "../middlewares/validateData.js";
import {
  userSignUpSchema,
  userLogInSchema,
  userOtpVerificationSchema,
} from "../validators/userSchema.js";
import {
  getUserLogin,
  getUserLoginVerification,
  getUserSignup,
  postUserLogin,
  postVerifyOtp,
  postUserSignup,
} from "../controllers/authController.js";

const router = Router();

router.get("/login", getUserLogin);
router.get("/loginVerification", getUserLoginVerification);
router.get("/signup", getUserSignup);

router.post(
  "/login",
  upload.none(),
  validateData(userLogInSchema),
  postUserLogin
);
router.post(
  "/loginVerification",
  upload.none(),
  validateData(userOtpVerificationSchema),
  postVerifyOtp
);
router.post(
  "/signup",
  upload.none(),
  validateData(userSignUpSchema),
  postUserSignup
);

export default router;
