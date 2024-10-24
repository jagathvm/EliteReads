import { Router } from "express";
import upload from "../middlewares/upload.js";
import validateData from "../middlewares/validateData.js";
import { adminLogInSchema } from "../validators/adminSchema.js";
import { userSignUpSchema, userLogInSchema } from "../validators/userSchema.js";
import {
  getAdminLogin,
  postAdminLogin,
  getUserLogin,
  getUserLoginVerification,
  getUserSignup,
  postUserSignup,
  postUserLogin,
  postVerifyOtp,
} from "../controllers/authController.js";

const router = Router();

router.get("/adminLogin", getAdminLogin);
router.get("/login", getUserLogin);
router.get("/loginVerification", getUserLoginVerification);
router.get("/signup", getUserSignup);

router.post(
  "/adminLogin",
  upload.none(),
  validateData(adminLogInSchema),
  postAdminLogin
);
router.post(
  "/login",
  upload.none(),
  validateData(userLogInSchema),
  postUserLogin
);
router.post("/loginVerification", upload.none(), postVerifyOtp);
router.post(
  "/signup",
  upload.none(),
  validateData(userSignUpSchema),
  postUserSignup
);

export default router;
