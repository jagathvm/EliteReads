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
import { fetchUserDataFromReq, updateUser } from "../services/userServices.js";
import { sendResponse, renderResponse } from "../helpers/responseHelper.js";
import {
  addReadlistData,
  getReadlistByUserId,
  updateReadlistData,
} from "../services/readlistServices.js";
import {
  addCartData,
  fetchAggregatedCartData,
  fetchCartByUserId,
  removeCartData,
  updateCartData,
} from "../services/cartServices.js";
import { buildCartObject, updateCartObject } from "../helpers/cartHelper.js";
import { capitalisation, formatDate } from "../helpers/stringHelper.js";
import {
  sanitizeEditAddress,
  sanitizePostAddress,
} from "../helpers/profileHelper.js";
import { buildOrderObject } from "../helpers/orderHelper.js";
import { buildReadlistObject } from "../helpers/readlistHelper.js";
import { addOrderData, getOrdersByUserId } from "../services/orderServices.js";

// ------------------ HOME & STATIC PAGES ------------------

// Render User Home Page
export const getUserHome = async (req, res) => {
  const { userId } = req?.user;

  try {
    const user = await fetchUserDataFromReq(req);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-home", {
      req,
      user,
      books,
      categories,
      cart,
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
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-about", {
      req,
      user,
      cart,
      readlist,
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
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-contact", {
      req,
      user,
      cart,
      readlist,
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
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-privacy-policy", {
      req,
      user,
      cart,
      readlist,
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
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-terms-conditions", {
      req,
      user,
      cart,
      readlist,
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
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-purchase-guide", {
      req,
      user,
      cart,
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

// ------------------ STORE & PRODUCT PAGES ------------------

// Render Store Page
export const getUserStore = async (req, res) => {
  const { userId } = req?.user;

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

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

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
      cart,
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
  const { userId } = req?.user;
  const { bookSlug } = req?.params;

  try {
    const user = await fetchUserDataFromReq(req);
    const book = await fetchBookDataBySlug(bookSlug);
    const books = await fetchBooksData();
    const categories = await fetchCategoriesData();
    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);
    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-product", {
      req,
      user,
      book,
      books,
      cart,
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
  const { userId } = req?.user;
  try {
    // Fetch user
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-cart", {
      req,
      cart,
      readlist,
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
export const postUserCart = async (req, res) => {
  const { bookId } = req?.body;
  const { userId } = req?.user;

  try {
    const { title } = await fetchBookDataById(bookId);
    const existingCart = await fetchCartByUserId(userId);

    if (!existingCart) {
      // If cart doesn't exist, create a new one
      const cartObject = buildCartObject(userId, bookId);

      const { acknowledged } = await addCartData(cartObject);
      if (!acknowledged)
        return sendResponse(
          res,
          400,
          `Error occurred while adding "${title}" to the cart.`,
          false
        );

      return sendResponse(res, 200, `"${title}" added to cart.`, true);
    }

    // If cart exists, add the new book
    const updatedCart = updateCartObject(existingCart, bookId);

    // Update cart
    const { modifiedCount } = await updateCartData(
      { userId },
      { $set: updatedCart }
    );

    if (!modifiedCount)
      return sendResponse(res, 400, `Failed to add "${title}" to cart.`, false);

    return sendResponse(res, 200, `"${title}" added to cart.`, true);
  } catch (error) {
    console.error(
      `An error occurred during addition or deletion of book to cart. ${error}`
    );
    throw error;
  }
};

// Remove Book from Cart
export const removeBookFromCart = async (req, res) => {
  const { bookId } = req?.body;
  const { userId } = req?.user;

  try {
    // Fetch the user's cart
    const cart = await fetchCartByUserId(userId);

    // Fetch the book details
    const { title } = await fetchBookDataById(bookId);

    // Check if cart exists
    if (!cart)
      return sendResponse(res, 404, "Cart does not exist for the user.", false);

    // Find the book in the cart
    const bookIndex = cart?.books?.findIndex(
      (book) => book.bookId.toString() === bookId
    );

    // If the book does not exist in the cart, return a 404 response
    if (bookIndex === -1) {
      return sendResponse(
        res,
        404,
        "The specified book does not exist in the cart.",
        false
      );
    }

    // Remove the book from the cart
    cart.books.splice(bookIndex, 1);

    // Update the updatedAt field
    cart.updatedAt = new Date();

    // Update the cart
    const { modifiedCount } = await updateCartData({ userId }, { $set: cart });
    if (!modifiedCount)
      return sendResponse(
        res,
        400,
        `Error removing ${title} from the cart.`,
        false
      );

    return sendResponse(res, 200, `"${title}" removed from the cart`, true);
  } catch (error) {
    console.error("Error removing book from cart: ", error);
  }
};

// Update quantity, subTotal of both Cart and Book
export const putUserCartQuantity = async (req, res) => {
  const { bookId, quantityIncrement } = req?.body;
  const { userId } = req?.user;

  try {
    const cart = await fetchCartByUserId(userId);

    const existingBookInCart = cart?.books?.find(
      (book) => book?.bookId.toString() === bookId
    );

    if (!existingBookInCart)
      return sendResponse(
        res,
        404,
        "Book already removed from the cart",
        false
      );

    const incrementValue = quantityIncrement ? 1 : -1;
    // Update book's quantity and price
    existingBookInCart.cartQuantity += incrementValue;

    if (existingBookInCart.cartQuantity >= existingBookInCart.bookQuantity)
      return sendResponse(
        res,
        400,
        "Maximum quantity that can be bought exceeded.",
        false
      );

    // Update Cart's updatedDate
    cart.updatedAt = new Date();

    const { modifiedCount } = await updateCartData({ userId }, { $set: cart });

    if (!modifiedCount)
      return sendResponse(
        res,
        400,
        `Error occured when ${quantityIncrement ? "incrementing" : "decrementing"} quantity.`,
        false
      );

    return sendResponse(res, 200, null, true, {
      cartQuantity: existingBookInCart.cartQuantity,
    });
  } catch (error) {
    console.error("Error updating cart quantity: ", error);
    throw error;
  }
};

// Render Readlist Page
export const getUserReadlist = async (req, res) => {
  const { userId } = req?.user;

  try {
    const user = await fetchUserDataFromReq(req);

    // Fetch user's readlist
    const readlist = await getReadlistByUserId(userId);

    // Fetch user's cart
    const cart = await fetchAggregatedCartData(userId);

    const books = await fetchBooksDataFromReadlist(readlist);

    return renderResponse(res, 200, "user/user-readlist", {
      req,
      user,
      books,
      cart,
      readlist,
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
  const { bookId } = req?.body;
  const { userId } = req?.user;

  try {
    const { title } = await fetchBookDataById(bookId);
    const existingReadList = await getReadlistByUserId(userId);

    if (!existingReadList) {
      const readListObject = buildReadlistObject(userId, bookId);

      const { acknowledged } = await addReadlistData(readListObject);
      if (!acknowledged)
        return sendResponse(
          res,
          400,
          `Error adding "${title}  to the readlist."`,
          false
        );

      return sendResponse(res, 200, `"${title}" added to readlist.`, true, {
        quantity: 1,
      });
    }

    const bookExistsInReadlist = existingReadList.books.includes(bookId);
    if (bookExistsInReadlist) {
      // Find the index of the bookId to remove
      const bookIndex = existingReadList.books.findIndex((id) => id === bookId);

      // If bookId not found
      if (bookIndex === -1)
        return sendResponse(
          res,
          400,
          `Failed to remove "${title}" from readlist.`,
          false
        );

      // Remove the bookId
      existingReadList.books.splice(bookIndex, 1);
      existingReadList.updatedAt = new Date();

      const { modifiedCount } = await updateReadlistData(
        { userId },
        { $set: existingReadList }
      );
      if (!modifiedCount)
        return sendResponse(
          res,
          400,
          `Failed to remove "${title}" from readlist.`,
          false
        );
      return sendResponse(
        res,
        200,
        `"${title}" removed from readlist.`,
        false,
        { heart: false }
      );
    }

    // Update books and updatedAt fields
    existingReadList.books.push(bookId);
    existingReadList.updatedAt = new Date();

    const { modifiedCount } = await updateReadlistData(
      { userId },
      { $set: existingReadList }
    );

    if (!modifiedCount)
      return sendResponse(
        res,
        400,
        `Failed to add "${title}" to readlist.`,
        false
      );
    return sendResponse(res, 200, `"${title}" added to readlist.`, true, {
      heart: true,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      "Something went wrong. Please try again.",
      false
    );
  }
};

// Render User Profile Page
export const getUserProfile = async (req, res) => {
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    const readlist = await getReadlistByUserId(userId);

    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-profile", {
      req,
      formatDate,
      cart,
      readlist,
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

export const getUserAddress = async (req, res) => {
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    const readlist = await getReadlistByUserId(userId);

    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-address", {
      req,
      cart,
      readlist,
      user,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(
      `An unexpected error occurred in rendering user address. ${error}`
    );
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    const readlist = await getReadlistByUserId(userId);

    const cart = await fetchAggregatedCartData(userId);

    const orders = await getOrdersByUserId(userId);

    return renderResponse(res, 200, "user/user-orders", {
      req,
      cart,
      readlist,
      user,
      orders,
      formatDate,
      capitalisation,
      currentPath: req.path,
    });
  } catch (error) {
    console.log(
      `An unexpected error occurred in rendering user orders. ${error}`
    );
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

export const postUserAddress = async (req, res) => {
  const newAddress = sanitizePostAddress(req.validData);

  try {
    const user = await fetchUserDataFromReq(req);

    const updateQuery = user.addresses
      ? { $push: { addresses: newAddress } }
      : { $set: { addresses: [newAddress] } };

    const { modifiedCount } = await updateUser({ _id: user._id }, updateQuery);

    if (!modifiedCount)
      return sendResponse(res, 400, "Failed to add address.", false);

    return sendResponse(res, 200, "Address added successfully.", true);
  } catch (error) {
    console.error(
      `An unexpected error occurred while inserting/updating address. ${error}`
    );
    return sendResponse(
      res,
      500,
      "Something went wrong. Please try again later.",
      false
    );
  }
};

export const editUserAddress = async (req, res) => {
  const { addressId } = req.params;
  const updatedAddress = sanitizeEditAddress(req.validData);

  try {
    const user = await fetchUserDataFromReq(req);

    // Build update query with only changed fields
    const updateQuery = {};
    for (const key in updatedAddress) {
      updateQuery[`addresses.$.${key}`] = updatedAddress[key];
    }

    const { modifiedCount } = await updateUser(
      { _id: user._id, "addresses._id": addressId },
      { $set: updateQuery }
    );

    if (!modifiedCount) {
      return sendResponse(res, 500, "Failed to update address.", false);
    }

    return sendResponse(res, 200, "Address updated successfully.", true);
  } catch (error) {
    console.error(
      `An unexpected error occurred while updating user address. ${error}`
    );
    return sendResponse(
      res,
      500,
      "Something went wrong. Please try again later.",
      false
    );
  }
};

export const deleteUserAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const user = await fetchUserDataFromReq(req);

    const { modifiedCount } = await updateUser(
      { _id: user._id },
      { $pull: { addresses: { _id: addressId } } }
    );

    if (!modifiedCount)
      return sendResponse(
        res,
        400,
        "Address not found or already deleted.",
        false
      );

    return sendResponse(res, 200, "Address deleted successfully.", true);
  } catch (error) {
    console.error(
      `An unexpected error occurred while deleting user address. ${error}`
    );
    return sendResponse(
      res,
      500,
      "Something went wrong. Please try again later.",
      false
    );
  }
};

export const getUserCheckout = async (req, res) => {
  const { userId } = req?.user;
  try {
    const user = await fetchUserDataFromReq(req);

    const readlist = await getReadlistByUserId(userId);

    const cart = await fetchAggregatedCartData(userId);

    return renderResponse(res, 200, "user/user-checkout", {
      req,
      user,
      readlist,
      cart,
      currentPath: req.path,
    });
  } catch (error) {
    console.error(`An unexpected occured: ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};

export const postUserPlaceOrder = async (req, res) => {
  const { userId } = req?.user;

  try {
    const { selectedAddress, paymentMethod } = req.body;

    if (!selectedAddress || !paymentMethod) {
      return sendResponse(res, 400, "Missing required fields.", false);
    }

    if (paymentMethod === "upi") {
      return sendResponse(
        res,
        400,
        "UPI payment is currently unavailable. Please choose Cash on Delivery.",
        false
      );
    }

    // Fetch user and cart data
    const user = await fetchUserDataFromReq(req);
    const cart = await fetchAggregatedCartData(userId);

    // Full address object
    const addressObj = user.addresses.find(
      (addr) => addr._id === selectedAddress
    );

    if (!addressObj)
      return sendResponse(res, 404, "Selected address not found.", false);

    if (!cart.books || cart.books.length === 0)
      return sendResponse(
        res,
        400,
        "Your cart is empty. Add items before placing an order.",
        false
      );

    // Create order object
    const orderObject = buildOrderObject(
      userId,
      addressObj,
      cart,
      paymentMethod
    );

    const { acknowledged } = await addOrderData(orderObject);

    if (!acknowledged)
      return sendResponse(
        res,
        400,
        `Error placing order. Please try again later.`,
        false
      );

    const { deletedCount } = await removeCartData({ userId });
    if (!deletedCount)
      return sendResponse(
        res,
        400,
        `Error placing order. Please try again later.`,
        false
      );

    return sendResponse(res, 200, "Order placed successfully.", true);
  } catch (error) {
    console.error(`An unexpected occured while placing order: ${error}`);
    return sendResponse(
      res,
      500,
      `Internal Server Error. ${error.message}`,
      false
    );
  }
};
