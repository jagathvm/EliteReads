// ------------------ IMPORTS ------------------
import {
  fetchBookDataBySlug,
  fetchBooksCount,
  fetchBooksData,
  fetchBooksDataByFiltersAndSort,
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

// ------------------ HOME & STATIC PAGES ------------------

// Render User Home Page
const getUserHome = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "user/user-home", {
      req,
      user,
      books,
      categories,
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
const getUserAbout = async (req, res) => {
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
const getUserContact = async (req, res) => {
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
const getUserPrivacyPolicy = async (req, res) => {
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
const getUserTermsConditions = async (req, res) => {
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
const getUserPurchaseGuide = async (req, res) => {
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
const getUserStore = async (req, res) => {
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
const getUserBook = async (req, res) => {
  const { bookSlug } = req.params;

  try {
    const user = await fetchUserDataFromReq(req);
    const book = await fetchBookDataBySlug(bookSlug);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "user/user-product", {
      req,
      user,
      book,
      books,
      categories,
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
const getUserCart = async (req, res) => {
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

// Render Readlist Page
const getUserReadlist = async (req, res) => {
  try {
    const user = await fetchUserDataFromReq(req);
    return renderResponse(res, 200, "user/user-readlist", {
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

// Render User Profile Page
const getUserProfile = async (req, res) => {
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

// ------------------ EXPORTS ------------------
export {
  getUserHome,
  getUserAbout,
  getUserContact,
  getUserPrivacyPolicy,
  getUserPurchaseGuide,
  getUserTermsConditions,
  getUserStore,
  getUserBook,
  getUserCart,
  getUserReadlist,
  getUserProfile,
};
