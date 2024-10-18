import { ObjectId } from "mongodb";
import {
  capitalisation,
  attachSubCategoriesToCategories,
  slugWithIsbn,
} from "../utils/utils.js";
import { validateData } from "../utils/validationHandler.js";
import {
  bookSchema,
  categorySchema,
  subCategorySchema,
} from "../validators/adminSchema.js";
import { sendResponse, renderResponse } from "../utils/responseHandler.js";
import {
  deleteImagesFromCloudinary,
  uploadImagesToCloudinary,
} from "../utils/cloudinaryHandler.js";
import {
  getBook,
  addBook,
  removeBook,
  updateBook,
  getCategory,
  getSubcategory,
  addSubcategory,
  updateCategory,
  addCategory,
  removeCategory,
  removeSubcategory,
  updateSubcategory,
  getBooks,
  getCategories,
  getSubcategories,
  getUsers,
  getUser,
} from "../services/dbServices.js";

const getAdminDashboard = (req, res) => {
  req.app.set("layout", "admin/layout/layout-admin");
  return renderResponse(res, 200, "admin/admin-dashboard", { req });
};

const getAdminBooks = async (req, res) => {
  try {
    const {
      found: booksFound,
      errorMessage: booksNotFound,
      value: books,
    } = await getBooks();

    if (!booksFound) return sendResponse(res, 404, booksNotFound, false);

    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 404, categoriesNotFound, false);

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
    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 404, categoriesNotFound, false);

    await attachSubCategoriesToCategories(categories);

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
  const { slugWithIsbn } = req.params;

  try {
    const {
      found: bookFound,
      errorMessage: bookNotFound,
      value: book,
    } = await getBook({ slugWithIsbn });

    if (!bookFound) return sendResponse(res, 404, bookNotFound, false);

    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 404, categoriesNotFound, false);

    await attachSubCategoriesToCategories(categories);

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

const getAdminOrders = (req, res) => {
  return renderResponse(res, 200, "admin/admin-orders-list", { req });
};

const getAdminOrderDetails = (req, res) => {
  return renderResponse(res, 200, "admin/admin-order-details", { req });
};

const getAdminAddCategory = async (req, res) => {
  try {
    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 400, categoriesNotFound, false);

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
    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 400, categoriesNotFound, false);

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
  try {
    const { categorySlug: slug } = req.params;

    const { found: categoryFound, value: category } = await getCategory({
      slug,
    });
    if (!categoryFound) return renderResponse(res, 404, "admin/404", { req });

    const { found: categoriesFound, value: categories } = await getCategories();
    if (!categoriesFound)
      return sendResponse(res, 404, "Oops! Something went wrong.", false);

    const { found: subCategoriesFound, value: subCategories } =
      await getSubcategories({ _id: { $in: category.subCategories || [] } });
    if (!subCategoriesFound)
      return sendResponse(res, 404, "Oops! Something went wrong.", false);

    return renderResponse(res, 200, "admin/admin-category-details", {
      req,
      category,
      categories,
      subCategories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, error.message, false);
  }
};

const getAdminSubCategoryDetails = async (req, res) => {
  try {
    const { subCategorySlug: slug } = req.params;

    const { found: subCategoryFound, value: subCategory } =
      await getSubcategory({ slug });
    if (!subCategoryFound)
      return renderResponse(res, 404, "admin/404", { req });

    const { found: subCategoriesFound, value: subCategories } =
      await getSubcategories({ _id: { $in: category.subCategories || [] } });
    if (!subCategoriesFound)
      return sendResponse(res, 404, "Oops! Something went wrong.", false);

    const { found: parentCategoryFound, value: parentCategory } =
      await getCategory({ name: subCategory.parent_category });
    if (!parentCategoryFound)
      return sendResponse(res, 404, "Oops! Something went wrong.", false);

    const { found: categoriesFound, value: categories } = await getCategories();
    if (!categoriesFound)
      return sendResponse(res, 404, "Oops! Something went wrong.", false);

    return renderResponse(res, 200, "admin/admin-subcategory-details", {
      req,
      subCategory,
      subCategories,
      parentCategory,
      categories,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(res, 500, error.message, false);
  }
};

const getAdminSellers = (req, res) => {
  return renderResponse(res, 200, "admin/admin-sellers-cards", { req });
};

const getAdminSellerProfile = (req, res) => {
  return renderResponse(res, 200, "admin/admin-seller-profile", {
    req,
  });
};

const getAdminTransactions = (req, res) => {
  return renderResponse(res, 200, "admin/admin-transactions", { req });
};

const getAdminReviews = (req, res) => {
  return renderResponse(res, 200, "admin/admin-reviews", { req });
};

const getAdminReviewDetails = (req, res) => {
  return renderResponse(res, 200, "admin/admin-review-details", {
    req,
  });
};

const getAdminSettings = (req, res) => {
  return renderResponse(res, 200, "admin/admin-settings", { req });
};

const getAdminUsers = async (req, res) => {
  const { found: usersFound, value: users } = await getUsers();
  if (!usersFound) return renderResponse(res, 404, "admin/404", { req });

  return renderResponse(res, 200, "admin/admin-users-cards", {
    req,
    users,
  });
};

const getAdminUserProfile = async (req, res) => {
  const { id: userId } = req.params;

  const { found: userFound, value: user } = await getUser({
    _id: new ObjectId(userId),
  });
  if (!userFound) return renderResponse(res, 404, "admin/404", { req });

  return renderResponse(res, 200, "admin/admin-user-profile", {
    req,
    user,
  });
};

const getAdminAuthors = (req, res) => {
  return renderResponse(res, 200, "admin/admin-authors", { req });
};

const getAdminAuthorProfile = (req, res) => {
  return renderResponse(res, 200, "admin/admin-author-profile", {
    req,
  });
};

const postAdminAddBook = async (req, res) => {
  const rawData = { ...req.body };
  const coverImages = req.files;
  const { featured: isFeatured, ...data } = rawData;
  data.featured = isFeatured === "on" ? true : false;

  try {
    // validate data to upload
    const {
      valid,
      value: bookData,
      errorMessage,
    } = validateData(data, bookSchema);

    if (!valid) {
      // Send validation error response if data is invalid
      return sendResponse(res, 400, errorMessage, false);
    }

    // Check for uploaded images
    if (!coverImages || coverImages.length === 0) {
      return sendResponse(res, 400, "No files uploaded", false);
    }

    // Upload images and retrieve URLS
    const coverImageUrls = await uploadImagesToCloudinary(coverImages, "books");

    // Add image URLS and slugWithIsbn value to the bookData
    bookData.coverImageUrls = coverImageUrls;
    bookData.slugWithIsbn = slugWithIsbn(bookData);

    // Add the book data to the database
    const result = await addBook(bookData);
    if (!result.acknowledged) {
      return sendResponse(res, 400, "Book Upload Failed.", false);
    }

    // Send success response
    return sendResponse(res, 200, "Book Added Successfully", true);
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);

    // Send error response
    return sendResponse(res, 500, "An unexpected error occurred.", false);
  }
};

const editAdminBook = async (req, res) => {
  // Extract book identifier from request parameters
  const { slugWithIsbn: bookSlug } = req.params;
  const { removedImageUrls, featured: isFeatured, ...data } = { ...req.body };

  // Convert 'featured' checkbox to boolean
  data.featured = isFeatured === "true" ? true : false;

  // Extract updated image files from the request
  const updatedImages = req.files;
  // Parse removed image file URLs if provided
  const parsedRemovedImageUrls = removedImageUrls
    ? JSON.parse(removedImageUrls)
    : [];

  try {
    // Validate book data
    const {
      valid,
      value: updatedBookData,
      errorMessage: updatedBookDataError,
    } = validateData(data, bookSchema);

    if (!valid) {
      // Send validation error response if data is invalid
      return sendResponse(res, 400, updatedBookDataError, false);
    }

    // Retrieve the existing book by its slugWithIsbn
    const {
      found,
      value: book,
      errorMessage: bookError,
    } = await getBook({ slugWithIsbn: bookSlug });
    if (!found) {
      // Send error response if book is not found
      return sendResponse(res, 404, bookError, false);
    }

    // Generate new slug if title or ISBN changes
    if (
      book.title !== updatedBookData.title ||
      book.isbn !== updatedBookData.isbn
    ) {
      updatedBookData.slugWithIsbn = slugWithIsbn(updatedBookData);

      // Check if the new slug already exists to avoid conflicts
      const { value: existingBook } = await getBook({
        slugWithIsbn: updatedBookData.slugWithIsbn,
      });
      if (existingBook) {
        return sendResponse(
          res,
          400,
          "A book with the same title or ISBN already exists.",
          false
        );
      }
    }

    // Filter remaining image URLs
    const currentImageUrls = book.coverImageUrls || [];
    const remainingImageUrls = currentImageUrls.filter(
      (url) => !parsedRemovedImageUrls.includes(url)
    );

    // Ensure there is at least one image (either uploaded or remaining)
    if (updatedImages.length === 0 && remainingImageUrls.length === 0)
      return sendResponse(res, 404, "No files uploaded.", false);

    // Remove the images from Cloudinary that are marked for removal
    if (parsedRemovedImageUrls.length > 0) {
      await deleteImagesFromCloudinary(parsedRemovedImageUrls, "books");
    }

    // Update the book's image URLs by removing the old ones
    await updateBook(
      { slugWithIsbn: bookSlug },
      { $pull: { coverImageUrls: { $in: parsedRemovedImageUrls } } }
    );

    if (updatedImages.length > 0) {
      const updatedImagesUrls = await uploadImagesToCloudinary(
        updatedImages,
        "books"
      );

      // Update the book's image URLs by adding the new ones
      await updateBook(
        { slugWithIsbn: bookSlug },
        {
          $push: { coverImageUrls: { $each: updatedImagesUrls } },
          $set: updatedBookData,
        }
      );

      // Send success response
      return sendResponse(
        res,
        200,
        "Updated Book Details",
        true,
        updatedBookData.slugWithIsbn
      );
    }

    // If no new images are uploaded, just update the book data
    await updateBook({ slugWithIsbn: bookSlug }, { $set: updatedBookData });

    // Send success response
    return sendResponse(
      res,
      200,
      "Updated Book Details",
      true,
      updatedBookData.slugWithIsbn
    );
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

const deleteAdminBook = async (req, res) => {
  try {
    // Extract book identifier from request parameters
    const { slugWithIsbn } = req.params;

    // Retrieve the book to ensure it exists before deletion
    const { found, value: book } = await getBook({ slugWithIsbn });
    if (!found) {
      // Send error response if book is not found
      return sendResponse(res, 404, "Book Not Found.", false);
    }

    // Delete associated images from Cloudinary
    if (book.coverImageUrls?.length > 0) {
      await deleteImagesFromCloudinary(book.coverImageUrls, "books");
    }

    // Remove the book from the database
    const result = await removeBook({ slugWithIsbn });
    if (result.deletedCount !== 1) {
      // Send error response if deletion fails
      return sendResponse(res, 400, "Failed to Delete Book Data", false);
    }

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
    const { parent_category, ...data } = { ...req.body };

    // Validate incoming category data
    const {
      valid,
      value: categoryData,
      errorMessage: categoryDataError,
    } = validateData(data, categorySchema);

    if (!valid)
      // Send error response
      return sendResponse(res, 400, categoryDataError, false);

    // Add parent_category to categoryData object
    categoryData.parent_category = parent_category;

    // Check if a category with the same name or slug already exists
    const { found: categoryFound } = await getCategory({
      $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
    });

    if (categoryFound)
      // Send error response if category exists
      return sendResponse(res, 400, "Category already exists.", false);

    // Check if a subcategory with the same name or slug already exists
    const { found: subCategoryFound } = await getSubcategory({
      $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
    });

    if (subCategoryFound)
      // Send error response if subCategory exists
      return sendResponse(res, 400, "Subcategory already exists.", false);

    // Handle category addition if parent_category is not present
    if (!parent_category) {
      const { acknowledged } = await addCategory(categoryData);

      if (!acknowledged)
        // Send error response
        return sendResponse(res, 400, "Error Adding Category.", false);

      // Send success response
      return sendResponse(res, 200, "Category Added Successfully.", true);
    }

    // Handle subcategory addition if parent_category is present
    const { acknowledged: subCategoryAdded, insertedId: subCategoryId } =
      await addSubcategory(categoryData);
    if (!subCategoryAdded)
      // Send error response
      return sendResponse(res, 400, "Failed to add subcategory.", false);

    // Update the parent category by pushing the new subcategory ID
    const { acknowledged: categoryUpdated } = await updateCategory(
      { name: parent_category },
      { $push: { subCategories: subCategoryId } }
    );

    if (!categoryUpdated)
      // Send error response
      return sendResponse(res, 400, "Failed to update parent category.", false);

    // Send success response
    return sendResponse(
      res,
      200,
      "Subcategory Added and parent category Updated.",
      true
    );
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
  const { categorySlug: slug } = req.params;

  try {
    const { parent_category, ...data } = { ...req.body };

    // Validate incoming category data
    const {
      valid,
      value: updatedCategoryData,
      errorMessage: validationError,
    } = validateData(data, categorySchema);

    // If validation fails, return a 400 status with the error message
    if (!valid) return sendResponse(res, 400, validationError, false);

    // Add parent_category to the updatedCategoryData
    updatedCategoryData.parent_category = parent_category;

    // Check if the category with the given slug exists in the database
    const {
      found: categoryFound,
      value: category,
      errorMessage: categoryNotFound,
    } = await getCategory({ slug });

    if (!categoryFound)
      // If category is not found, return a 404 status
      return sendResponse(res, 404, categoryNotFound, false);

    // Check if the updated data is the same as the existing category data
    const isDataUnchanged =
      updatedCategoryData.name === category.name &&
      updatedCategoryData.description === category.description &&
      updatedCategoryData.slug === category.slug &&
      (updatedCategoryData.parent_category === category.parent_category ||
        (!updatedCategoryData.parent_category && !category.parent_category));

    // If there are no changes, return a 200 status with a message
    if (isDataUnchanged)
      return sendResponse(
        res,
        200,
        "No changes were made to the category.",
        true
      );

    // If parent_category is not provided, update the category with the new data
    if (!parent_category) {
      const updateCategoryResult = await updateCategory(
        { slug },
        { $set: updatedCategoryData }
      );

      // If the update fails, return a 400 status
      if (!updateCategoryResult.modifiedCount)
        return sendResponse(
          res,
          400,
          "Error occurred while updating category.",
          false
        );

      // Success: return a 200 status with a success message
      return sendResponse(res, 200, "Category updated successfully.", true);
    }

    // Prevent changing the parent_category if the category has subcategories
    if (parent_category && category.subCategories?.length > 0)
      return sendResponse(
        res,
        400,
        "Cannot change parent category as this category contains subcategories.",
        false
      );

    // Insert the category as subcategory of parent_category
    const { acknowledged, insertedId } =
      await addSubcategory(updatedCategoryData);

    // If subcategory insertion fails, return a 400 status
    if (!acknowledged)
      return sendResponse(res, 400, "Unable to process your request", false);

    // Reference the subCategory ID to the parent_category
    const updateParentCategoryResult = await updateCategory(
      { name: parent_category },
      { $push: { subCategories: insertedId } }
    );

    // If updating the parent category fails, return a 400 status
    if (!updateParentCategoryResult.modifiedCount)
      return sendResponse(res, 400, "Unable to process your request.", false);

    // After successful addition of subcategory, delete the original category
    const deleteCategoryResult = await removeCategory({ slug });

    // If deletion of the original category fails, return a 400 status
    if (!deleteCategoryResult.deletedCount)
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

const editAdminSubCategory = async (req, res) => {
  const { subCategorySlug: slug } = req.params;
  const { parent_category, ...data } = { ...req.body };

  try {
    // Validate the subcategory data against subcategory schema
    const {
      valid,
      value: updatedSubCategoryData,
      errorMessage: validationError,
    } = validateData(data, subCategorySchema);
    if (!valid)
      // Send error response
      return sendResponse(res, 400, validationError, false);

    updatedSubCategoryData.parent_category = parent_category;

    // Find the subcategory by slug
    const {
      found: subCategoryFound,
      value: subCategory,
      errorMessage: subCategoryNotFound,
    } = await getSubcategory({ slug });

    if (!subCategoryFound)
      // Send error response
      return sendResponse(res, 404, subCategoryNotFound, false);

    // Case 1: If no parent_category, convert subcategory to a main category
    if (!parent_category) {
      // Create a new main category
      const insertAsCategory = await addCategory({
        ...updatedSubCategoryData,
        subCategories: [],
      });

      if (!insertAsCategory.acknowledged)
        return sendResponse(res, 400, "Unable to process your request.", false);

      // Remove subcategory from its old parent category
      const parentCategoryUpdateResult = await updateCategory(
        { name: subCategory.parent_category },
        { $pull: { subCategories: subCategory._id } }
      );

      if (!parentCategoryUpdateResult.modifiedCount)
        return sendResponse(res, 400, "Unable to process your request.", false);

      // Delete the subcategory
      const deleteSubcategoryResult = await removeSubcategory({ slug });

      if (!deleteSubcategoryResult.deletedCount)
        // Send error response
        return sendResponse(res, 400, "Unable to process your request.", false);

      // Send success response
      return sendResponse(
        res,
        201,
        "Subcategory successfully updated to a main category.",
        true,
        `${slug}`
      );
    }

    // Case 2: If parent_category has changed, move the subcategory under the new parent
    if (parent_category !== subCategory.parent_category) {
      // Remove the subcategory ID from the old parent category's subCategories array
      const [oldParentUpdate, newParentUpdate] = await Promise.all([
        updateCategory(
          { name: subCategory.parent_category },
          { $pull: { subCategories: subCategory._id } }
        ),
        updateCategory(
          { name: parent_category },
          { $push: { subCategories: subCategory._id } }
        ),
      ]);

      if (!(oldParentUpdate.modifiedCount && newParentUpdate.modifiedCount))
        return sendResponse(res, 400, "Unable to update subcategory.", false);

      //Update the subcategory data
      const updateSubCategoryResult = await updateSubcategory(
        { slug },
        { $set: updatedSubCategoryData }
      );

      if (!updateSubCategoryResult.modifiedCount)
        // Send error response
        return sendResponse(res, 400, "Error updating subcategory.", false);

      // Send success response
      return sendResponse(
        res,
        200,
        `Subcategory successfully moved to "${parent_category}".`,
        true,
        `${parent_category}`
      );
    }

    // Case 3: If parent_category hasn't changed
    //Update the subcategory data
    const updateSubCategoryResult = await updateSubcategory(
      { slug },
      { $set: updatedSubCategoryData }
    );

    if (!updateSubCategoryResult.modifiedCount)
      // Send error response
      return sendResponse(res, 400, "Error updating subcategory.", false);

    // Send success response
    return sendResponse(
      res,
      200,
      "Subcategory updated successfully",
      true,
      `${subCategory.parent_category}/${slug}`
    );
  } catch (error) {
    // If any unexpected error occurs, log it and send a 500 response
    console.error(`An unexpected error occured. ${error}`);
    return sendResponse(res, 500, "An unexpected error occured.", false);
  }
};

const deleteAdminSubcategory = async (req, res) => {
  const { subCategorySlug: slug } = req.params;

  try {
    // Fetch the subcategory by slug
    const {
      found: subCategoryFound,
      value: subCategory,
      errorMessage: subCategoryNotFound,
    } = await getSubcategory({ slug });

    // If subcategory not found, return a 404 response
    if (!subCategoryFound) {
      return sendResponse(res, 404, subCategoryNotFound, false);
    }

    // Update parent category by removing the subcategory from subCategories array
    const updateParentCategoryResult = await updateCategory(
      {
        name: subCategory.parent_category,
      },
      { $pull: { subCategories: subCategory._id } }
    );

    // If parent category wasn't updated, return a general error
    if (!updateParentCategoryResult.modifiedCount)
      return sendResponse(
        res,
        500,
        "An error occurred while processing your request.",
        false
      );

    // Remove the subcategory
    const deleteSubcategoryResult = await removeSubcategory({ slug });

    // If subcategory wasn't deleted, return a 404 response
    if (!deleteSubcategoryResult.deletedCount)
      return sendResponse(
        res,
        404,
        "Subcategory not found or already deleted.",
        false
      );

    // If everything goes fine, return a 204 No Content response
    return sendResponse(res, 204);
  } catch (error) {
    console.error(`An unexpected error occured. ${error}`);
    return sendResponse(res, 500, "An unexpected error occured.", false);
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
  getAdminSubCategoryDetails,
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
  deleteAdminBook,
  postAdminAddCategory,
  editAdminCategory,
  deleteAdminCategory,
  editAdminSubCategory,
  deleteAdminSubcategory,
};
