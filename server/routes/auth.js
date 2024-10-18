import { Router } from "express";
import upload from "../middlewares/upload.js";
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

router.post("/adminLogin", upload.none(), postAdminLogin);
router.post("/login", upload.none(), postUserLogin);
router.post("/loginVerification", upload.none(), postVerifyOtp);
router.post("/signup", upload.none(), postUserSignup);

export default router;
