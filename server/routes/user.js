import { Router } from "express";
import {
  authenticateToken,
  checkUserLoggedIn,
} from "../middlewares/authenticate.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.use(checkUserLoggedIn);
router.get("/", userController.getUserHome);
router.get("/about", userController.getUserAbout);
router.get("/contact", userController.getUserContact);
router.get("/privacy-policy", userController.getUserPrivacyPolicy);
router.get("/book-details/:bookSlug", userController.getUserBook);
router.get("/book-store", userController.getUserStore);
router.get("/terms-conditions", userController.getUserTermsConditions);
router.get("/purchase-guide", userController.getUserPurchaseGuide);

router.use(authenticateToken);
router.get("/profile", userController.getUserProfile);
router.get("/readlist", userController.getUserReadlist);
router.get("/cart", userController.getUserCart);

export default router;
