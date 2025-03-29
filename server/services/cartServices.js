import {
  addDocument,
  getAggregatedDocuments,
  getDocument,
  removeDocument,
  updateDocument,
} from "../helpers/dbHelper.js";
import { getCartCollection } from "../config/db.js";

// Core CRUD Operations
export const fetchCartByUserId = async (userId) => {
  try {
    const { value: cart } = await getDocument(
      { userId },
      getCartCollection,
      "Cart not found."
    );

    return cart;
  } catch (error) {
    console.error("Error retrieving cart", error);
    throw error;
  }
};

export const addCartData = async (cart) => {
  try {
    const insertResult = await addDocument(cart, getCartCollection);

    return insertResult;
  } catch (error) {
    console.error("Error adding readlist", error);
    throw error;
  }
};

export const updateCartData = async (query, operation) => {
  try {
    const updateResult = await updateDocument(
      query,
      operation,
      getCartCollection
    );

    return updateResult;
  } catch (error) {
    console.error(`Error updating readlist`, error);
  }
};

export const removeCartData = async (query) => {
  try {
    const deleteResult = await removeDocument(query, getCartCollection);

    return deleteResult;
  } catch (error) {
    console.error(`Error deleting cart: ${error}`);
    throw error;
  }
};

// Data aggregation and fetching
export const getAggregatedCart = async (pipeline) => {
  try {
    const cart = await getAggregatedDocuments(
      pipeline,
      getCartCollection,
      "Error retrieving cart."
    );

    return cart;
  } catch (error) {
    console.error(`Error retrieving cart: ${error}`);
    throw error;
  }
};

export const fetchAggregatedCartData = async (userId) => {
  const cartData = await fetchCartByUserId(userId);

  if (!cartData) return;
  if (cartData?.books?.length === 0) return cartData;

  const pipeline = [
    {
      $match: { userId },
    },
    {
      $unwind: "$books",
    },
    {
      $lookup: {
        from: "books",
        localField: "books.bookId",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $addFields: {
        "books.bookDetails": "$bookDetails",
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        createdAt: 1,
        updatedAt: 1,
        books: {
          cartQuantity: "$books.cartQuantity",
          bookId: "$books.bookId",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          bookSlug: "$bookDetails.bookSlug",
          coverImageUrl: {
            $arrayElemAt: ["$bookDetails.coverImageUrls", 0],
          },
          price: "$bookDetails.price",
          bookQuantity: "$bookDetails.quantity",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        userId: {
          $first: "$userId",
        },
        books: {
          $push: "$books",
        },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  ];

  try {
    const { value } = await getAggregatedCart(pipeline);
    const cart = value?.[0] || {};
    return cart;
  } catch (error) {
    console.error("Error fetching cart data", error);
    throw error;
  }
};
