import Router from "express";
import * as adminController from "../controllers/adminController.js";
import upload from "../middlewares/upload.js";
import validateData from "../middlewares/validateData.js";
import { authenticateToken } from "../middlewares/authenticate.js";
import {
  bookSchema,
  categorySchema,
  editBookSchema,
  editCategorySchema,
} from "../validators/adminSchema.js";

const router = Router();

router.use(authenticateToken);
router.get("/dashboard", adminController.getAdminDashboard);
router.get("/books", adminController.getAdminBooks);
router.get("/books/add-book", adminController.getAdminAddBook);
router.get("/books/:bookSlug", adminController.getAdminBookDetails);
router.get("/categories/add-category", adminController.getAdminAddCategory);
router.get("/categories", adminController.getAdminCategories);
router.get(
  "/categories/:categorySlug",
  adminController.getAdminCategoryDetails
);
router.get("/users", adminController.getAdminUsers);
router.get("/user-profile/:username", adminController.getAdminUserProfile);
router.patch("/user-profile/:username", adminController.blockOrUnblockUser);
router.get("/orders", adminController.getAdminOrders);
router.get("/order-details/:orderId", adminController.getAdminOrderDetails);
router.post("/order-details/:orderId", adminController.updateOrderStatus);
router.get("/sellers", adminController.getAdminSellers);
router.get("/seller-profile", adminController.getAdminSellerProfile);
router.get("/reviews", adminController.getAdminReviews);
router.get("/review-details", adminController.getAdminReviewDetails);
router.get("/settings", adminController.getAdminSettings);
router.get("/transactions", adminController.getAdminTransactions);

router.post(
  "/books/add-book",
  upload.array("cover_image", 6),
  validateData(bookSchema),
  adminController.postAdminAddBook
);
router.patch(
  "/books/:bookSlug/upload",
  upload.array("cover_image", 6),
  adminController.editAdminBookImage
);
router.patch(
  "/books/:bookSlug",
  validateData(editBookSchema),
  adminController.editAdminBook
);
router.post("/books/:bookSlug/quantity", adminController.editAdminBookQuantity);
router.delete("/books/:bookSlug", adminController.deleteAdminBook);

router.post(
  "/categories/add-category",
  validateData(categorySchema),
  adminController.postAdminAddCategory
);
router.patch(
  "/categories/:categorySlug",
  validateData(editCategorySchema),
  adminController.editAdminCategory
);
router.delete("/categories/:categorySlug", adminController.deleteAdminCategory);

export default router;
