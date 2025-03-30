import { ObjectId } from "mongodb";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinaryHelper.js";
import {
  addCategory,
  updateCategory,
  removeCategory,
  fetchCategoriesData,
  fetchCategoriesDataByName,
  fetchCategoriesDataBySlug,
  fetchCategoryDataBySlug,
} from "../services/categoriesServices.js";
import {
  addBook,
  updateBook,
  removeBook,
  fetchBooksData,
  fetchBookDataByTitle,
  fetchBookDataByIsbn,
  fetchBookDataBySlug,
} from "../services/booksServices.js";
import {
  createSlug,
  capitalisation,
  formatDate,
} from "../helpers/stringHelper.js";
import {
  fetchUsersData,
  fetchUserData,
  fetchUserDataFromReq,
  updateUser,
} from "../services/userServices.js";
import { sendResponse, renderResponse } from "../helpers/responseHelper.js";
import { buildBookObject, processBookData } from "../helpers/bookHelper.js";
import { processCategoryData } from "../helpers/categoryHelper.js";
import { getAllOrders, getOrderByOrderId } from "../services/orderServices.js";

// ------------------ ADMIN CONTROLLERS ------------------ //

// Render the Admin Dashboard page.
export const getAdminDashboard = (req, res) => {
  req.app.set("layout", "admin/layout/layout-admin");
  return renderResponse(res, 200, "admin/admin-dashboard", { req });
};

// Render the Admin Settings page.
export const getAdminSettings = (req, res) =>
  renderResponse(res, 200, "admin/admin-settings", { req });

// ----------------- ADMIN BOOKS ------------------ //

// Fetch and display all books.
export const getAdminBooks = async (req, res) => {
  try {
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "admin/admin-books", {
      req,
      books,
      categories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, error.message, false);
  }
};

// Render the Admin Add Book form.
export const getAdminAddBook = async (req, res) => {
  try {
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "admin/admin-add-book", {
      req,
      categories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, error.message, false);
  }
};

// Render book details for a specific book.
export const getAdminBookDetails = async (req, res) => {
  const { bookSlug } = req.params;

  try {
    const book = await fetchBookDataBySlug(bookSlug);
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "admin/admin-book-details", {
      req,
      book,
      capitalisation,
      categories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

// Add a new book to the database.
export const postAdminAddBook = async (req, res) => {
  const { title, isbn } = req.validData;
  const coverImages = req.files;

  try {
    const bookFoundWithSameTitle = await fetchBookDataByTitle(title);
    if (bookFoundWithSameTitle)
      return sendResponse(
        res,
        400,
        "Book with same title already exists",
        false
      );

    const bookFoundWithSameISBN = await fetchBookDataByIsbn(isbn);
    if (bookFoundWithSameISBN)
      return sendResponse(
        res,
        400,
        "Book with same ISBN already exists",
        false
      );

    if (!coverImages || coverImages.length === 0)
      return sendResponse(res, 400, "No cover images uploaded", false);

    const coverImageUrls = await uploadToCloudinary(coverImages, "books");
    const newBook = buildBookObject(req.validData, coverImageUrls);

    const { acknowledged } = await addBook(newBook);
    if (!acknowledged)
      return sendResponse(res, 400, "Failed to add book", false);

    return sendResponse(res, 200, "Book added successfully", true);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return sendResponse(res, 500, "An unexpected error occurred", false);
  }
};

// Edit a book in the database.
export const editAdminBook = async (req, res) => {
  const { bookSlug } = req.params;
  // Process changed data using the helper function
  const changedData = processBookData(req.validData);

  try {
    // Retrieve the current book from the database
    const book = await fetchBookDataBySlug(bookSlug);

    // Check if title is provided and if there's already a book with the same title
    if (changedData.title) {
      const existingBookWithTitle = await fetchBookDataByTitle(
        changedData.title
      );

      if (existingBookWithTitle) {
        return sendResponse(
          res,
          400,
          "A book with the same title already exists.",
          false
        );
      }
    }

    // Check if ISBN is provided and if there's already a book with the same ISBN
    if (changedData.isbn) {
      const existingBookWithIsbn = await fetchBookDataByIsbn(changedData.isbn);

      if (existingBookWithIsbn) {
        return sendResponse(
          res,
          400,
          "A book with the same ISBN already exists.",
          false
        );
      }
    }

    // Generate the new slug based on title and ISBN
    const newTitle = changedData?.title || book.title;
    const newIsbn = changedData?.isbn || book.isbn;
    changedData.bookSlug = `${createSlug(newTitle)}-${newIsbn}`;

    // Update the book in the database
    const { modifiedCount } = await updateBook(
      { bookSlug },
      { $set: changedData }
    );
    if (!modifiedCount)
      return sendResponse(res, 400, "Failed to update book", false);

    return sendResponse(
      res,
      200,
      "Book updated successfully",
      true,
      changedData?.bookSlug ? changedData.bookSlug : book.bookSlug
    );
  } catch (error) {
    console.error(`An unexpected error occurred. ${error.message}`);
    // Send error response
    return sendResponse(
      res,
      500,
      "An error occurred while updating the book.",
      false
    );
  }
};

// Edit a book's cover images in the database.
export const editAdminBookImage = async (req, res) => {
  const { bookSlug } = req.params;
  const { removedImageUrls } = req.body;
  const coverImages = req.files;

  try {
    if (!removedImageUrls && coverImages.length > 0) {
      const uploadedCoverImageUrls = await uploadToCloudinary(
        coverImages,
        "books"
      );

      const { modifiedCount } = await updateBook(
        { bookSlug },
        {
          $push: {
            coverImageUrls: {
              $each: uploadedCoverImageUrls,
            },
          },
        }
      );

      if (!modifiedCount)
        return sendResponse(res, 400, "Failed to update cover image.", false);

      return sendResponse(res, 200, "Cover image updated.", true);
    }

    const urlsToRemove = JSON.parse(removedImageUrls);

    if (removedImageUrls && coverImages.length === 0) {
      // Delete images from Cloudinary
      await deleteFromCloudinary(JSON.parse(removedImageUrls), "books");

      // Update the book in the database
      const { modifiedCount } = await updateBook(
        { bookSlug },
        {
          $pull: { coverImageUrls: { $in: urlsToRemove } },
        }
      );

      if (!modifiedCount)
        return sendResponse(
          res,
          400,
          "Failed to update book cover image.",
          false
        );

      return sendResponse(res, 200, "Cover image updated.", true);
    }

    if (removedImageUrls && coverImages.length > 0) {
      // Delete images from Cloudinary
      await deleteFromCloudinary(JSON.parse(removedImageUrls), "books");

      const { modifiedCount: modifiedCountPull } = await updateBook(
        { bookSlug },
        {
          $pull: { coverImageUrls: { $in: urlsToRemove } },
        }
      );
      if (!modifiedCountPull)
        return sendResponse(
          res,
          400,
          "Failed to update book cover image.",
          false
        );

      // Upload newly uploaded images to Cloudinary
      const uploadedCoverImageUrls = await uploadToCloudinary(
        coverImages,
        "books"
      );

      const { modifiedCount: modifiedCountPush } = await updateBook(
        { bookSlug },
        {
          $push: { coverImageUrls: { $each: uploadedCoverImageUrls } },
        }
      );
      if (!modifiedCountPush) {
        return sendResponse(
          res,
          400,
          "Failed to update book cover image.",
          false
        );
      }

      return sendResponse(res, 200, "Cover image updated.", true);
    }
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    // Send error response
    return sendResponse(
      res,
      500,
      "An error occurred while updating the cover image.",
      false
    );
  }
};

// Edit book's quantity
export const editAdminBookQuantity = async (req, res) => {
  const { quantityIncrement, bookSlug } = req.body;
  const quantityValue = quantityIncrement ? 1 : -1;
  const successResponse = quantityIncrement ? "increment" : "decrement";
  const errorResponse = quantityIncrement ? "incrementing" : "decrementing";

  try {
    const { modifiedCount } = await updateBook(
      { bookSlug },
      { $inc: { quantity: quantityValue } }
    );

    if (!modifiedCount)
      return sendResponse(
        res,
        400,
        `An error occured while ${errorResponse} the quantity`,
        false
      );

    return sendResponse(
      res,
      200,
      `Quantity ${successResponse} successfull`,
      true,
      quantityIncrement
    );
  } catch (error) {
    console.error("An error occured. ", error.message);
    throw error;
  }
};

// Delete a book from the database
export const deleteAdminBook = async (req, res) => {
  const { bookSlug } = req.params;
  try {
    // Retrieve the book to ensure it exists before deletion
    const book = await fetchBookDataBySlug(bookSlug);
    if (!book)
      // Send error response if book is not found
      return sendResponse(res, 404, "Book Not Found.", false);

    // Delete associated images from Cloudinary
    if (book.coverImageUrls?.length > 0)
      await deleteFromCloudinary(book.coverImageUrls, "books");

    // Remove the book from the database
    const { deletedCount } = await removeBook({ bookSlug });
    if (!deletedCount)
      // Send error response if deletion fails
      return sendResponse(res, 400, "Failed to Delete Book Data", false);

    // Send success response with no content
    return sendResponse(res, 204);
  } catch (error) {
    console.error("Error deleting book:", error);
    // Send error response
    return sendResponse(
      res,
      500,
      "An error occurred while deleting the book." || error.message,
      false
    );
  }
};

// --------------------- ADMIN CATEGORIES --------------------- //

// Fetch and display all categories.
export const getAdminCategories = async (req, res) => {
  try {
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "admin/admin-categories", {
      req,
      categories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

// Render category details for a specific category.
export const getAdminCategoryDetails = async (req, res) => {
  const { categorySlug: slug } = req.params;

  try {
    const category = await fetchCategoryDataBySlug(slug);
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "admin/admin-category-details", {
      req,
      category,
      categories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, error.message, false);
  }
};

// Render the Admin Add Category form.
export const getAdminAddCategory = async (req, res) => {
  try {
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "admin/admin-add-category", {
      req,
      categories,
      capitalisation,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

// Add a new category or subcategory.
export const postAdminAddCategory = async (req, res) => {
  const { name, description, parentCategory } = req.validData;
  const slug = createSlug(name);

  try {
    // Check if a category with the same name exists
    const catFoundByName = await fetchCategoriesDataByName([name]);

    // Check if a category with the same slug exists
    const catFoundBySlug = await fetchCategoriesDataBySlug([slug]);

    // Send error response if category exists
    if (catFoundByName)
      return sendResponse(
        res,
        400,
        "Category already exists with the same name.",
        false
      );

    if (catFoundBySlug)
      return sendResponse(
        res,
        400,
        "Category already exists with the same slug.",
        false
      );

    // Handle category addition
    const categoryData = {
      name,
      description,
      slug,
      parentCategory: parentCategory ? new ObjectId(parentCategory) : "",
    };
    const { acknowledged } = await addCategory(categoryData);

    // Send error response if category was not added
    if (!acknowledged)
      return sendResponse(res, 400, "Error adding category.", false);

    // Send success response if category was added
    return sendResponse(res, 200, `Category ${name} added.`, true);
  } catch (error) {
    console.error(`An unexpected error occurred. ${error.message}`);
    return sendResponse(
      res,
      500,
      "An unexpected error occurred. Please try again later.",
      false
    );
  }
};

// Edit a category or subcategory.
export const editAdminCategory = async (req, res) => {
  const { categorySlug } = req.params;
  const changedData = processCategoryData(req.validData);

  try {
    const categoryExits = await fetchCategoryDataBySlug(categorySlug);
    if (!categoryExits)
      return sendResponse(res, 404, "Category not found", false);

    const categoryNameExists = await fetchCategoriesDataByName([
      changedData?.name,
    ]);
    if (categoryNameExists)
      return sendResponse(
        res,
        400,
        "Category already exists with the same",
        false
      );

    if (changedData.name) {
      changedData.slug = createSlug(changedData.name);
    }

    // Update the category in the database
    const { acknowledged } = await updateCategory(
      { slug: categorySlug },
      { $set: changedData }
    );

    // If update was not acknowledged, return a 400 status
    if (!acknowledged)
      return sendResponse(res, 400, "Error updating category.", false);

    // Success: return a 200 status with a success message
    return sendResponse(res, 200, "Category updated.", true, changedData?.slug);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred", false);
  }
};

// Delete a category or subcategory.
export const deleteAdminCategory = async (req, res) => {
  const { categorySlug: slug } = req.params;

  try {
    // Find the category by slug
    const category = await fetchCategoriesDataBySlug([slug]);

    // Prevent deletion if subcategories exist
    if (category.subCategories?.length > 0)
      return sendResponse(
        res,
        400,
        "Category cannot be deleted as it has existing subcategories.",
        false
      );

    // Delete the category
    const deleteCategoryResult = await removeCategory({ slug });

    // Send error response if category was not deleted
    if (!deleteCategoryResult.deletedCount)
      return sendResponse(
        res,
        404,
        "Category not found or already deleted.",
        false
      );

    // Send success response if deletion is successful
    return sendResponse(res, 204);
  } catch (error) {
    console.error(`Error occurred while deleting category: ${error}`);
    return sendResponse(
      res,
      500,
      "An error occurred while processing your request.",
      false
    );
  }
};

// --------------------- ADMIN USERS --------------------- //

// Fetch and display all users.
export const getAdminUsers = async (req, res) => {
  try {
    const users = await fetchUsersData();

    return renderResponse(res, 200, "admin/admin-users-cards", {
      req,
      users,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

// Fetch and display a user's profile.
export const getAdminUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const currentUser = await fetchUserDataFromReq(req);
    const user = await fetchUserData(username);

    return renderResponse(res, 200, "admin/admin-user-profile", {
      req,
      user,
      currentUser,
      formatDate,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

// Block or Unblock a user.
export const blockOrUnblockUser = async (req, res) => {
  const { username } = req.params;
  const isBlocked = req.body.isBlocked === "true" ? false : true;

  try {
    const { modifiedCount } = await updateUser(
      { username },
      { $set: { "accountStatus.isBlocked": isBlocked } }
    );

    if (!modifiedCount)
      return res.status(400).json({
        success: false,
        message: `"Failed to ${isBlocked ? "block" : "unblock"} user."`,
      });

    return res.status(200).json({
      success: true,
      message: `User ${isBlocked ? "blocked" : "unblocked"}.`,
    });
  } catch (error) {
    console.log("Error blocking or unblocking user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    throw error;
  }
};

// --------------------- ADMIN SELLERS --------------------- //

// Fetch and display all sellers.
export const getAdminSellers = (req, res) =>
  renderResponse(res, 200, "admin/admin-sellers-cards", { req });

// Fetch and display a seller's profile.
export const getAdminSellerProfile = (req, res) =>
  renderResponse(res, 200, "admin/admin-seller-profile", { req });

// --------------------- ADMIN REVIEWS --------------------- //

// Fetch and display all reviews.
export const getAdminReviews = (req, res) =>
  renderResponse(res, 200, "admin/admin-reviews", { req });

// Fetch and display a review's details.
export const getAdminReviewDetails = (req, res) =>
  renderResponse(res, 200, "admin/admin-review-details", { req });

// --------------------- ADMIN ORDERS --------------------- //

// Fetch and display all orders.
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();

    return renderResponse(res, 200, "admin/admin-orders-list", {
      req,
      orders,
      capitalisation,
      formatDate,
    });
  } catch (error) {
    console.error("Error retrieving orders", error);
    throw error;
  }
};

// Render order details for a specific order.
export const getAdminOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderByOrderId(orderId);

    return renderResponse(res, 200, "admin/admin-order-details", {
      req,
      order,
      formatDate,
      capitalisation,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    throw error;
  }
};

// --------------------- ADMIN TRANSACTIONS --------------------- //
export const getAdminTransactions = (req, res) =>
  renderResponse(res, 200, "admin/admin-transactions", { req });
