import { ObjectId } from "mongodb";
import { capitalisation } from "../utils/utils.js";
import { slugWithIsbn } from "../helpers/userHelper.js";
import { sendResponse, renderResponse } from "../utils/responseHandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinaryHelper.js";
import {
  getAggregatedCategories,
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
} from "../services/categoriesServices.js";
import {
  getAggregatedBooks,
  getBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
} from "../services/booksServices.js";

const getAdminDashboard = (req, res) => {
  req.app.set("layout", "admin/layout/layout-admin");
  return renderResponse(res, 200, "admin/admin-dashboard", { req });
};

const getAdminBooks = async (req, res) => {
  try {
    const { value: books } = await getBooks();
    const { value: categories } = await getCategories();

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
    const pipeline = [
      {
        $match: {
          parentCategory: "",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subCategories",
        },
      },
    ];

    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getAggregatedCategories(pipeline);

    if (!categoriesFound)
      return sendResponse(res, 404, categoriesNotFound, false);

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
    const bookPipeline = [
      {
        $match: {
          bookSlug,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subcategory",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const categoriesPipeline = [
      {
        $match: {
          parentCategory: "",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subCategories",
        },
      },
    ];

    const {
      value: [book],
    } = await getAggregatedBooks(bookPipeline);

    const { value: categories } =
      await getAggregatedCategories(categoriesPipeline);

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
    const { value: categories } = await getCategories();

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
    const categoriesPipeline = [
      {
        $match: {
          parentCategory: "",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subCategories",
        },
      },
    ];
    const { value: categories } =
      await getAggregatedCategories(categoriesPipeline);

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
    const categoryPipeline = [
      {
        $match: { slug },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parentCategory",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: {
          path: "$parentCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subCategories",
        },
      },
    ];

    const {
      found: categoryFound,
      value: [category],
    } = await getAggregatedCategories(categoryPipeline);
    if (!categoryFound) return renderResponse(res, 404, "admin/404", { req });

    const { value: categories } = await getCategories();

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
  renderResponse(res, 200, "admin/admin-seller-profile", {
    req,
  });

const getAdminTransactions = (req, res) =>
  renderResponse(res, 200, "admin/admin-transactions", { req });

const getAdminReviews = (req, res) =>
  renderResponse(res, 200, "admin/admin-reviews", { req });

const getAdminReviewDetails = (req, res) =>
  renderResponse(res, 200, "admin/admin-review-details", {
    req,
  });

const getAdminSettings = (req, res) =>
  renderResponse(res, 200, "admin/admin-settings", { req });

const getAdminUsers = async (req, res) => {
  const { found: usersFound, value: users } = await getUsers();
  if (!usersFound) return renderResponse(res, 404, "admin/404", { req });

  return renderResponse(res, 200, "admin/admin-users-cards", {
    req,
    users,
  });
};

const getAdminUserProfile = async (req, res) => {
  const { username } = req.params;

  const { found: userFound, value: user } = await getUser({ username });
  if (!userFound) return renderResponse(res, 404, "admin/404", { req });

  return renderResponse(res, 200, "admin/admin-user-profile", {
    req,
    user,
  });
};

const getAdminAuthors = (req, res) =>
  renderResponse(res, 200, "admin/admin-authors", { req });

const getAdminAuthorProfile = (req, res) =>
  renderResponse(res, 200, "admin/admin-author-profile", {
    req,
  });

const postAdminAddBook = async (req, res) => {
  const isFeatured = req.validData.featured === "on";
  const { title, isbn } = req.validData;
  const coverImages = req.files;

  try {
    const { found: bookFound } = await getBook({
      $or: [{ title }, { isbn }],
    });
    if (bookFound) return sendResponse(res, 400, "Book already exists", false);

    if (!coverImages || coverImages.length === 0)
      return sendResponse(res, 400, "No cover images uploaded", false);

    const coverImageUrls = await uploadToCloudinary(coverImages, "books");
    const bookSlug = slugWithIsbn(title, isbn);

    const newBook = {
      title,
      author: req.validData.author,
      description: req.validData.description,
      price: req.validData.price,
      isbn,
      publisher: req.validData.publisher,
      year: req.validData.year,
      language: req.validData.language,
      pages: req.validData.pages,
      weight: req.validData.weight,
      featured: isFeatured,
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
  const { title, isbn } = req.validData;
  const updatedBookData = {
    title,
    author: req.validData.author,
    language: req.validData.language,
    featured: Boolean(req.validData.featured),
    description: req.validData.description,
    price: req.validData.price,
    isbn,
    publisher: req.validData.publisher,
    year: req.validData.year,
    pages: req.validData.pages,
    weight: req.validData.weight,
    category: new ObjectId(req.validData.category),
    subcategory: req.validData.subcategory
      ? new ObjectId(req.validData.subcategory)
      : "",
  };

  try {
    const {
      found: bookFound,
      errorMessage: bookNotFound,
      value: book,
    } = await getBook({ bookSlug });
    if (!bookFound) return sendResponse(res, 404, bookNotFound, false);

    if (book.title !== title || book.isbn !== isbn) {
      updatedBookData.bookSlug = slugWithIsbn(title, isbn);

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

      return sendResponse(res, 200, "Book updated successfully", true);
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
  try {
    const { name, slug, description, parentCategory } = req.validData;

    // Check if a category with the same name or slug already exists
    const { found: categoryFound } = await getCategory({
      $or: [{ name }, { slug }],
    });

    // Send error response if category exists
    if (categoryFound)
      return sendResponse(
        res,
        400,
        "Category already exists with the same name or slug.",
        false
      );

    // Handle category addition
    const { acknowledged } = await addCategory({
      name,
      description,
      slug,
      parentCategory: parentCategory ? new ObjectId(parentCategory) : "",
    });

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
  const { name, description, slug, parentCategory } = req.validData;

  try {
    const {
      found: categoryFound,
      value: category,
      errorMessage: categoryNotFound,
    } = await getCategory({ slug: categorySlug });

    // If category is not found, return a 404 status
    if (!categoryFound) return sendResponse(res, 404, categoryNotFound, false);

    // Check if any data has changed when the front-end validation fails
    const isUnchanged =
      category.name === name &&
      category.description === description &&
      category.slug === slug &&
      category.parentCategory === parentCategory;

    // If no changes were made, return a 400 status
    if (isUnchanged)
      return sendResponse(
        res,
        400,
        "No changes were made to the category.",
        false
      );

    // Update the category in the database
    const { acknowledged } = await updateCategory(
      { slug: categorySlug },
      {
        $set: {
          name,
          description,
          slug,
          parentCategory: new ObjectId(parentCategory),
        },
      }
    );

    // If update was not acknowledged, return a 400 status
    if (!acknowledged)
      return sendResponse(res, 400, "Error updating category.", false);

    // Success: return a 200 status with a success message
    return sendResponse(res, 200, "Category updated.", true);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error}`);
    return sendResponse(res, 500, "An unexpected error occurred", false);
  }
};

const deleteAdminCategory = async (req, res) => {
  const { categorySlug: slug } = req.params;

  try {
    // Find the category by slug
    const {
      found: categoryFound,
      value: category,
      errorMessage: categoryNotFound,
    } = await getCategory({ slug });

    // Return error if category is not found
    if (!categoryFound) return sendResponse(res, 404, categoryNotFound, false);

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
  getAdminAuthors,
  getAdminAuthorProfile,
  postAdminAddBook,
  editAdminBook,
  editAdminBookImage,
  deleteAdminBook,
  postAdminAddCategory,
  editAdminCategory,
  deleteAdminCategory,
};
