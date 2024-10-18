import { Router } from "express";
// import { authenticateToken } from "../middlewares/authenticate.js";
import * as userController from "../controllers/userController.js";

const router = Router();

// Render homepage
router.get("/", userController.getUserHome);
router.get("/about", userController.getUserAbout);
router.get("/contact", userController.getUserContact);
router.get("/privacy-policy", userController.getUserPrivacyPolicy);
router.get("/book-details/:slugWithIsbn", userController.getUserBook);
router.get("/book-store", userController.getUserStore);
router.get("/terms-conditions", userController.getUserTermsConditions);

router.get("/profile", userController.getUserProfile);
router.get("/readlist", userController.getUserReadlist);
router.get("/cart", userController.getUserCart);

export default router;
