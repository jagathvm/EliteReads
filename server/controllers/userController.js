import { ObjectId } from "mongodb";
import { getBooks, getBook } from "../services/booksServices.js";
import { getCategories } from "../services/categoriesServices.js";
import { getUser } from "../services/userServices.js";
import { renderResponse } from "../utils/responseHandler.js";

const getUserHome = async (req, res) => {
  try {
    const { value: categories } = await getCategories();
    const { value: books } = await getBooks();

    let user = null;
    if (req.user) {
      const { value: userData } = await getUser({
        _id: new ObjectId(req.user.userId),
      });
      user = userData;
    }

    return renderResponse(res, 200, "user/user-home", {
      req,
      user,
      categories,
      books,
    });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error. ${error.message}`,
    });
  }
};

const getUserAbout = (req, res) => {
  res.status(200).render("user/user-about", { req });
};

const getUserContact = (req, res) => {
  res.status(200).render("user/user-contact", { req });
};

const getUserStore = async (req, res) => {
  try {
    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 400, categoriesNotFound, false);

    const {
      found: booksFound,
      errorMessage: booksNotFound,
      value: books,
    } = await getBooks();

    if (!booksFound) return sendResponse(res, 404, booksNotFound, false);

    return res
      .status(200)
      .render("user/user-store", { req, categories, books });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return res.status(500).json({
      sucess: false,
      message: `Internal Server Error. ${error.message}`,
    });
  }
};

const getUserPrivacyPolicy = (req, res) => {
  res.status(200).render("user/user-privacy-policy", { req });
};

const getUserCart = (req, res) => {
  res.status(200).render("user/user-cart", { req });
};

const getUserReadlist = (req, res) => {
  res.status(200).render("user/user-readlist", { req });
};

const getUserProfile = (req, res) => {
  res.status(200).render("user/user-profile", { req });
};

const getUserBook = async (req, res) => {
  const { slugWithIsbn } = req.params;

  try {
    const {
      found: categoriesFound,
      errorMessage: categoriesNotFound,
      value: categories,
    } = await getCategories();

    if (!categoriesFound)
      return sendResponse(res, 400, categoriesNotFound, false);

    const {
      found: booksFound,
      errorMessage: booksNotFound,
      value: books,
    } = await getBooks();

    if (!booksFound) return sendResponse(res, 404, booksNotFound, false);

    const {
      found: bookFound,
      errorMessage: bookNotFound,
      value: book,
    } = await getBook({ slugWithIsbn });

    if (!bookFound) return sendResponse(res, 404, bookNotFound, false);

    return res
      .status(200)
      .render("user/user-product", { req, categories, books, book });
  } catch (error) {
    console.error(`An unexpected error occurred. ${error}`);
    return res.status(500).json({
      sucess: false,
      message: `Internal Server Error. ${error.message}`,
    });
  }
};

const getUserTermsConditions = (req, res) => {
  res.status(200).render("user/user-terms-conditions", { req });
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
