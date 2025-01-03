// ------------------ IMPORTS ------------------
import {
  fetchBookDataById,
  fetchBookDataBySlug,
  fetchBooksCount,
  fetchBooksData,
  fetchBooksDataByFiltersAndSort,
  fetchBooksDataFromReadlist,
  fetchUniqueValuesFromBooksData,
  sanitizeQuery,
} from "../services/booksServices.js";
import {
  fetchCategoriesData,
  fetchCategoriesDataByIds,
  uniqueCategoryIds,
} from "../services/categoriesServices.js";
import { fetchUserDataFromReq } from "../services/userServices.js";
import { sendResponse, renderResponse } from "../helpers/responseHelper.js";
import {
  addReadlistData,
  getReadlistByUserId,
  updateReadlistData,
} from "../services/readlistServices.js";

// ------------------ HOME & STATIC PAGES ------------------

// Render User Home Page
export const getUserHome = async (req, res) => {
  const userId = req?.user?.userId;

  try {
    const user = await fetchUserDataFromReq(req);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    return renderResponse(res, 200, "user/user-home", {
      req,
      user,
      books,
      categories,
      readlist,
      currentPath: req.path,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Render About Page
export const getUserAbout = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-about", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Render Contact Page
export const getUserContact = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-contact", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Render Privacy Policy Page
export const getUserPrivacyPolicy = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-privacy-policy", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Render Terms & Conditions Page
export const getUserTermsConditions = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-terms-conditions", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Render Purchase Guide Page
export const getUserPurchaseGuide = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-purchase-guide", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// ------------------ STORE & PRODUCT PAGES ------------------

// Render Store Page
export const getUserStore = async (req, res) => {
  const userId = req?.user?.userId;

  try {
    // Sanitize the incoming query parameters
    const {
      sort: sortObject,
      page: currentPage,
      limit,
      ...queryObject
    } = await sanitizeQuery(req.query);

    // Calculate skip value for pagination
    const skipValue = parseInt((currentPage - 1) * limit);

    // Fetch the user data from the request
    const user = await fetchUserDataFromReq(req);

    // Fetch all books data
    const booksData = await fetchBooksData();

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch all filtered books data
    const books = await fetchBooksDataByFiltersAndSort(
      queryObject,
      sortObject,
      skipValue,
      limit
    );

    // Extract unique values of authors, languages, and publishers
    const authors = fetchUniqueValuesFromBooksData("author", booksData);
    const languages = fetchUniqueValuesFromBooksData("language", booksData);
    const publishers = fetchUniqueValuesFromBooksData("publisher", booksData);
    const categoryIds = uniqueCategoryIds(
      fetchUniqueValuesFromBooksData("category", booksData)
    );

    // Fetch categories and count
    const categories = await fetchCategoriesDataByIds(categoryIds);
    const booksCount = await fetchBooksCount(queryObject);
    const totalPages = Math.ceil(booksCount / limit);

    return renderResponse(res, 200, "user/user-store", {
      req,
      user,
      authors,
      books,
      categories,
      readlist,
      languages,
      publishers,
      currentPage,
      totalPages,
      currentPath: req.path,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Render Single Book Page
export const getUserBook = async (req, res) => {
  const userId = req?.user?.userId;
  const { bookSlug } = req.params;

  try {
    const user = await fetchUserDataFromReq(req);
    const [book] = await fetchBookDataBySlug(bookSlug);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();
    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    return renderResponse(res, 200, "user/user-product", {
      req,
      user,
      book,
      books,
      categories,
      readlist,
      currentPath: req.path,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// ------------------ USER PROFILE & FEATURES ------------------

// Render Cart Page
export const getUserCart = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-cart", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Post Cart
export const postUserCart = async (req, res) => {};

// Render Readlist Page
export const getUserReadlist = async (req, res) => {
  const userId = req?.user?.userId;

  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);
    const { value: books } = await fetchBooksDataFromReadlist(readlist);

    return renderResponse(res, 200, "user/user-readlist", {
      req,
      user,
      books,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

// Post Readlist
export const postUserReadlist = async (req, res) => {
  const { bookId } = req.body;
  const { userId } = req.user;

  try {
    const [{ title }] = await fetchBookDataById(bookId);
    const readList = await getReadlistByUserId(userId);

    if (!readList) {
      const readListObject = {
        userId,
        books: [bookId],
      };

      await addReadlistData(readListObject);
      return sendResponse(
        res,
        200,
        `"${title}" added to readlist.`,
        true,
        true
      );
    }

    const bookExistsInReadlist = readList.books.includes(bookId);
    if (bookExistsInReadlist) {
      await updateReadlistData({ userId }, { $pull: { books: bookId } });

      return sendResponse(
        res,
        400,
        `"${title}" removed from readlist.`,
        false,
        false
      );
    }

    await updateReadlistData({ userId }, { $push: { books: bookId } });
    return sendResponse(res, 200, `"${title}" added to readlist.`, true, true);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// Render User Profile Page
export const getUserProfile = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-profile", {
      req,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(`An unexpected error occurred. ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};
