import { Router } from "express";
import {
  authenticateToken,
  checkUserLoggedIn,
} from "../middlewares/authenticate.js";
import * as userController from "../controllers/userController.js";
import validateData from "../middlewares/validateData.js";
import {
  postAddressValidationSchema,
  editAddressValidationSchema,
} from "../validators/userSchema.js";

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
router.get("/profile/address", userController.getUserAddress);
router.get("/profile/orders", userController.getUserOrders);

router.post(
  "/profile/address",
  validateData(postAddressValidationSchema),
  userController.postUserAddress
);
router.patch(
  "/profile/address/:addressId",
  validateData(editAddressValidationSchema),
  userController.editUserAddress
);
router.delete("/profile/address/:addressId", userController.deleteUserAddress);

router.get("/readlist", userController.getUserReadlist);
router.post("/readlist", userController.postUserReadlist);
router.get("/cart", userController.getUserCart);
router.post("/cart", userController.postUserCart);
router.put("/cart/quantity-update", userController.putUserCartQuantity);
router.put("/cart/remove", userController.removeBookFromCart);
router.get("/cart/checkout", userController.getUserCheckout);
router.post("/cart/place-order", userController.postUserPlaceOrder);

export default router;
