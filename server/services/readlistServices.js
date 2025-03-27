import {
  addDocument,
  getDocument,
  updateDocument,
} from "../helpers/dbHelper.js";
import { getReadlistCollection } from "../config/db.js";

// Core CRUD Operations
export const getReadlistByUserId = async (userId) => {
  try {
    const { value: readlist } = await getDocument(
      { userId },
      getReadlistCollection,
      "Readlist not found."
    );

    return readlist;
  } catch (error) {
    console.error(error);
  }
};

export const addReadlistData = async (readlist) => {
  try {
    const insertResult = await addDocument(readlist, getReadlistCollection);

    return insertResult;
  } catch (error) {
    console.error("Error adding readlist", error);
    throw error;
  }
};

export const updateReadlistData = async (query, operation) => {
  try {
    const updateResult = await updateDocument(
      query,
      operation,
      getReadlistCollection
    );

    return updateResult;
  } catch (error) {
    console.error(`Error updating readlist`, error);
  }
};

// Data aggregation and fetching
export const getAggregatedReadlist = async (pipeline) => {
  try {
    const readlist = await getAggregatedDocuments(
      pipeline,
      getReadlistCollection,
      "Error retrieving readlist."
    );

    return readlist;
  } catch (error) {
    console.error(`Error retrieving readlist: ${error}`);
    throw error;
  }
};

export const fetchAggregatedReadlistData = async (userId) => {
  const readlistData = await getReadlistByUserId(userId);

  if (!readlistData) return {};
  if (readlistData?.books?.length === 0) return readlistData;

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
        books: {
          bookId: "$books.bookId",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          coverImageUrls: {
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
