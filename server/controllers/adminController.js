import { ObjectId } from "mongodb";
import { sendResponse, renderResponse } from "../helpers/responseHelper.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinaryHelper.js";
import {
  addCategory,
  updateCategory,
  removeCategory,
} from "../services/categoriesServices.js";
import {
  getBook,
  addBook,
  updateBook,
  removeBook,
} from "../services/booksServices.js";
import { fetchBooksData, fetchBookData } from "../helpers/booksHelper.js";
import {
  fetchCategoriesData,
  fetchCategoryData,
} from "../helpers/categoriesHelper.js";
import {
  createSlug,
  fetchUserData,
  capitalisation,
  sentenceCase,
} from "../helpers/userHelper.js";

const getAdminDashboard = (req, res) => {
  req.app.set("layout", "admin/layout/layout-admin");
  return renderResponse(res, 200, "admin/admin-dashboard", { req });
};

const getAdminBooks = async (req, res) => {
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

const getAdminAddBook = async (req, res) => {
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

const getAdminBookDetails = async (req, res) => {
  const { bookSlug } = req.params;

  try {
    const book = await fetchBookData(bookSlug);
    const categories = await fetchCategoriesData({ parentCategory: "" });

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

const getAdminOrders = (req, res) =>
  renderResponse(res, 200, "admin/admin-orders-list", { req });

const getAdminOrderDetails = (req, res) =>
  renderResponse(res, 200, "admin/admin-order-details", { req });

const getAdminAddCategory = async (req, res) => {
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

const getAdminCategories = async (req, res) => {
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

const getAdminCategoryDetails = async (req, res) => {
  const { categorySlug: slug } = req.params;

  try {
    const category = await fetchCategoryData(slug);
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

const getAdminSellers = (req, res) =>
  renderResponse(res, 200, "admin/admin-sellers-cards", { req });

const getAdminSellerProfile = (req, res) =>
  renderResponse(res, 200, "admin/admin-seller-profile", { req });

const getAdminTransactions = (req, res) =>
  renderResponse(res, 200, "admin/admin-transactions", { req });

const getAdminReviews = (req, res) =>
  renderResponse(res, 200, "admin/admin-reviews", { req });

const getAdminReviewDetails = (req, res) =>
  renderResponse(res, 200, "admin/admin-review-details", { req });

const getAdminSettings = (req, res) =>
  renderResponse(res, 200, "admin/admin-settings", { req });

const getAdminUsers = async (req, res) => {
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

const getAdminUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await fetchUserData(username);
    return renderResponse(res, 200, "admin/admin-user-profile", {
      req,
      user,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

// // Admin authors
// const getAdminAuthors = (req, res) =>
//   renderResponse(res, 200, "admin/admin-authors", { req });

// const getAdminAuthorProfile = (req, res) =>
//   renderResponse(res, 200, "admin/admin-author-profile", { req });

const postAdminAddBook = async (req, res) => {
  const {
    title,
    author: { firstName, lastName },
    isbn,
  } = req.validData;
  const coverImages = req.files;

  try {
    const bookFoundWithSameTitle = await fetchBookData({ title });
    if (bookFoundWithSameTitle)
      return sendResponse(
        res,
        400,
        "Book with same title already exists",
        false
      );

    const bookFoundWithSameISBN = await fetchBookData({ isbn });
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
    const bookSlug = `${createSlug(title)}-${isbn}`;

    const newBook = {
      title,
      author: `${firstName} ${lastName}`,
      description: sentenceCase(req.validData.description),
      price: parseFloat(req.validData.price),
      isbn: parseInt(req.validData.isbn),
      publisher: req.validData.publisher,
      year: parseInt(req.validData.year),
      language: req.validData.language,
      pages: parseInt(req.validData.pages),
      weight: parseFloat(req.validData.weight),
      featured: req.validData.featured === "on" ? true : false,
      coverImageUrls,
      bookSlug,
      category: new ObjectId(req.validData.category),
      subcategory: req.validData.subcategory
        ? new ObjectId(req.validData.subcategory)
        : "",
    };

    const { acknowledged } = await addBook(newBook);
    if (!acknowledged)
      return sendResponse(res, 400, "Failed to add book", false);

    return sendResponse(res, 200, "Book added successfully", true);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return sendResponse(res, 500, "An unexpected error occurred", false);
  }
};

const editAdminBook = async (req, res) => {
  const { bookSlug } = req.params;
  const { title, isbn } = req.body;
  const updatedBookData = {
    title,
    author: req.body.author,
    language: req.body.language,
    featured: req.body.featured === "true",
    description: sentenceCase(req.body.description),
    price: parseFloat(req.body.price),
    isbn: parseInt(req.body.isbn),
    publisher: req.body.publisher,
    year: parseInt(req.body.year),
    pages: parseInt(req.body.pages),
    weight: parseFloat(req.body.weight),
    category: new ObjectId(req.body.category),
    subcategory: req.body.subcategory ? new ObjectId(req.body.subcategory) : "",
  };

  try {
    const { value: book } = await getBook({ bookSlug });

    if (book.title !== title || book.isbn !== isbn) {
      updatedBookData.bookSlug = `${createSlug(title)}-${isbn}`;

      // Check if the new slug already exists to avoid conflicts
      const { found: bookExists } = await getBook({
        bookSlug: updatedBookData.bookSlug,
      });

      if (bookExists)
        return sendResponse(
          res,
          400,
          "A book with the same title and ISBN already exists.",
          false
        );

      // Update the book in the database
      const { acknowledged } = await updateBook(
        { bookSlug },
        {
          $set: updatedBookData,
        }
      );
      if (!acknowledged)
        return sendResponse(res, 400, "Failed to update book", false);

      return sendResponse(
        res,
        200,
        "Book updated successfully",
        true,
        updatedBookData.bookSlug
      );
    }

    // Update the book in the database
    const { acknowledged } = await updateBook(
      { bookSlug },
      {
        $set: updatedBookData,
      }
    );
    if (!acknowledged)
      return sendResponse(res, 400, "Failed to update book", false);

    return sendResponse(res, 200, "Book updated successfully", true);
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    // Send error response
    return sendResponse(
      res,
      500,
      "An error occurred while updating the book.",
      false
    );
  }
};

const editAdminBookImage = async (req, res) => {
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

const deleteAdminBook = async (req, res) => {
  const { bookSlug } = req.params;
  try {
    // Retrieve the book to ensure it exists before deletion
    const { found, value: book } = await getBook({ bookSlug });
    if (!found)
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

const postAdminAddCategory = async (req, res) => {
  const { name, description, parentCategory } = req.validData;
  const slug = createSlug(name);
  try {
    // Check if a category with the same name exists
    const { found: categoryFound } = await fetchCategoriesData({
      $or: [{ name }, { slug }],
    });

    // Send error response if category exists
    if (categoryFound)
      return sendResponse(
        res,
        400,
        "Category already exists with the same name.",
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
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      "An unexpected error occurred. Please try again later.",
      false
    );
  }
};

const editAdminCategory = async (req, res) => {
  const { categorySlug } = req.params;
  const { name, description, parentCategory } = req.validData;

  try {
    const category = await fetchCategoriesData({
      slug: categorySlug,
    });

    const slug = createSlug(name);
    // Check if any data has changed when the front-end validation fails
    const isUnchanged =
      category.name === name &&
      category.description === description &&
      category.parentCategory === parentCategory;

    // If no changes were made, return a 400 status
    if (isUnchanged)
      return sendResponse(
        res,
        400,
        "No changes were made to the category.",
        false
      );

    const categoryData = {
      name,
      description,
      slug,
      parentCategory: parentCategory ? new ObjectId(parentCategory) : "",
    };

    // Update the category in the database
    const { acknowledged } = await updateCategory(
      { slug: categorySlug },
      { $set: categoryData }
    );

    // If update was not acknowledged, return a 400 status
    if (!acknowledged)
      return sendResponse(res, 400, "Error updating category.", false);

    // Success: return a 200 status with a success message
    return sendResponse(res, 200, "Category updated.", true, slug);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred", false);
  }
};

const deleteAdminCategory = async (req, res) => {
  const { categorySlug: slug } = req.params;

  try {
    // Find the category by slug
    const category = await fetchCategoriesData({ slug });

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

export {
  getAdminDashboard,
  getAdminBooks,
  getAdminAddBook,
  getAdminBookDetails,
  getAdminOrders,
  getAdminOrderDetails,
  getAdminAddCategory,
  getAdminCategories,
  getAdminCategoryDetails,
  getAdminSellers,
  getAdminSellerProfile,
  getAdminTransactions,
  getAdminReviews,
  getAdminReviewDetails,
  getAdminSettings,
  getAdminUsers,
  getAdminUserProfile,
  // getAdminAuthors,
  // getAdminAuthorProfile,
  postAdminAddBook,
  editAdminBook,
  editAdminBookImage,
  deleteAdminBook,
  postAdminAddCategory,
  editAdminCategory,
  deleteAdminCategory,
};
