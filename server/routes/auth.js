import { Router } from "express";
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

router.post("/login", validateData(userLogInSchema), postUserLogin);
router.post(
  "/loginVerification",
  validateData(userOtpVerificationSchema),
  postVerifyOtp
);
router.post("/signup", validateData(userSignUpSchema), postUserSignup);

export default router;
