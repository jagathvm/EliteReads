import { fetchUserData } from "../helpers/userHelper.js";
import { fetchBookData, fetchBooksData } from "../helpers/bookHelper.js";
import { fetchCategoriesData } from "../helpers/categoryHelper.js";
import { renderResponse, sendResponse } from "../utils/responseHandler.js";
import { render } from "ejs";

const getUserHome = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "user/user-home", {
      req,
      user,
      books,
      categories,
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

const getUserAbout = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-about", { req, user });
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

const getUserContact = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-contact", { req, user });
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

const getUserStore = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "user/user-store", {
      req,
      user,
      books,
      categories,
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

const getUserPrivacyPolicy = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-privacy-policy", { req, user });
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

const getUserCart = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-cart", { req, user });
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

const getUserReadlist = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-readlist", { req, user });
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

const getUserProfile = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-profile", { req, user });
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

const getUserBook = async (req, res) => {
  const { bookSlug } = req.params;

  try {
    const user = await fetchUserData(req);
    const book = await fetchBookData(bookSlug);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    return renderResponse(res, 200, "user/user-product", {
      req,
      user,
      book,
      books,
      categories,
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

const getUserTermsConditions = async (req, res) => {
  try {
    const user = await fetchUserData(req);
    return renderResponse(res, 200, "user/user-terms-conditions", {
      req,
      user,
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

export {
  getUserHome,
  getUserAbout,
  getUserContact,
  getUserStore,
  getUserPrivacyPolicy,
  getUserBook,
  getUserCart,
  getUserReadlist,
  getUserProfile,
  getUserTermsConditions,
};
