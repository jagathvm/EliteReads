import Router from "express";
import * as adminController from "../controllers/adminController.js";
import upload from "../middlewares/upload.js";
import { authenticateToken } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticateToken);
router.get("/dashboard", adminController.getAdminDashboard);
router.get("/books/add-book", adminController.getAdminAddBook);
router.get("/books", adminController.getAdminBooks);
router.get("/books/:slugWithIsbn", adminController.getAdminBookDetails);
router.get("/authors", adminController.getAdminAuthors);
router.get("/author-profile", adminController.getAdminAuthorProfile);
router.get("/categories/add-category", adminController.getAdminAddCategory);
router.get("/categories", adminController.getAdminCategories);
router.get(
  "/categories/:categorySlug",
  adminController.getAdminCategoryDetails
);
router.get(
  "/categories/:categorySlug/:subCategorySlug",
  adminController.getAdminSubCategoryDetails
);
router.get("/users", adminController.getAdminUsers);
router.get("/user-profile/:id", adminController.getAdminUserProfile);
router.get("/orders", adminController.getAdminOrders);
router.get("/order-details", adminController.getAdminOrderDetails);
router.get("/sellers", adminController.getAdminSellers);
router.get("/seller-profile", adminController.getAdminSellerProfile);
router.get("/reviews", adminController.getAdminReviews);
router.get("/review-details", adminController.getAdminReviewDetails);
router.get("/settings", adminController.getAdminSettings);
router.get("/transactions", adminController.getAdminTransactions);

router.post(
  "/books/add-book",
  upload.array("cover_image", 6),
  adminController.postAdminAddBook
);
router.patch(
  "/books/:slugWithIsbn",
  upload.array("cover_image", 6),
  adminController.editAdminBook
);
router.delete("/books/:slugWithIsbn", adminController.deleteAdminBook);
router.post(
  "/categories/add-category",
  upload.none(),
  adminController.postAdminAddCategory
);
router.patch(
  "/categories/:categorySlug",
  upload.none(),
  adminController.editAdminCategory
);
router.delete("/categories/:categorySlug", adminController.deleteAdminCategory);
router.patch(
  "/categories/:categorySlug/:subCategorySlug",
  upload.none(),
  adminController.editAdminSubCategory
);
router.delete(
  "/categories/:categorySlug/:subCategorySlug",
  adminController.deleteAdminSubcategory
);

export default router;
