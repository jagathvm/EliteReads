import { ObjectId } from "mongodb";
import {
  addDocument,
  getAggregatedDocuments,
  getDocument,
  getDocuments,
  updateDocument,
} from "../helpers/dbHelper.js";
import { getOrdersCollection } from "../config/db.js";

export const addOrderData = async (order) => {
  try {
    const insertResult = await addDocument(order, getOrdersCollection);

    return insertResult;
  } catch (error) {
    console.error("Error adding order", error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    const { value, found } = await getDocuments(
      { userId },
      getOrdersCollection,
      "Error retrieving orders."
    );

    const orders = found ? value : [];

    return orders;
  } catch (error) {
    console.error("Error retrieving orders", error);
    throw error;
  }
};

export const getOrderByOrderId = async (orderId) => {
  try {
    const { value, found } = await getDocument(
      { _id: new ObjectId(orderId) },
      getOrdersCollection,
      "Order not found."
    );

    const order = found ? value : [];

    return order;
  } catch (error) {
    console.error("Error retrieving orders", error);
    throw error;
  }
};

export const updateOrderData = async (orderId, operation) => {
  try {
    const updateResult = await updateDocument(
      { _id: new ObjectId(orderId) },
      operation,
      getOrdersCollection
    );

    return updateResult;
  } catch (error) {
    console.error("Error updating order", error);
    throw error;
  }
};

export const fetchAggregatedOrderByOrderId = async (orderId) => {
  const pipeline = [
    {
      $match: {
        _id: new ObjectId(orderId),
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "books",
        localField: "items.bookId",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        address: 1,
        totalPrice: 1,
        orderStatus: 1,
        createdAt: 1,
        items: {
          quantity: "$items.quantity",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          bookSlug: "$bookDetails.bookSlug",
          price: "$items.price",
          coverImageUrl: {
            $arrayElemAt: ["$bookDetails.coverImageUrls", 0],
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        address: { $first: "$address" },
        totalPrice: { $first: "$totalPrice" },
        orderStatus: { $first: "$orderStatus" },
        createdAt: { $first: "$createdAt" },
        items: { $push: "$items" },
      },
    },
    {
      $addFields: {
        orderIdStr: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "orderIdStr",
        foreignField: "orderId",
        as: "payment",
      },
    },
    {
      $unwind: "$payment",
    },
    {
      $project: {
        orderIdStr: 0,
      },
    },
  ];

  try {
    const { found, value } = await getAggregatedDocuments(
      pipeline,
      getOrdersCollection,
      "Order not found."
    );

    const order = found ? value[0] : [];
    return order;
  } catch (error) {
    console.error("Error retrieving order", error);
    throw error;
  }
};

export const fetchAggregatedOrders = async (status, dateRange) => {
  const pipeline = [];

  if (status !== null) {
    pipeline.push({
      $match: {
        "orderStatus.id": status,
      },
    });
  }

  if (dateRange) {
    pipeline.push({
      $match: {
        createdAt: dateRange,
      },
    });
  }

  try {
    const { found, value } = await getAggregatedDocuments(
      pipeline,
      getOrdersCollection,
      "Orders not found."
    );

    const orders = found ? value : [];
    return orders;
  } catch (error) {
    console.error("Error retrieving orders", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const { value, found } = await getDocuments(
      {},
      getOrdersCollection,
      "Error retrieving orders."
    );

    const orders = found ? value : [];

    return orders;
  } catch (error) {
    console.error("Error retrieving orders", error);
    throw error;
  }
};
