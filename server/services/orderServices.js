import { ObjectId } from "mongodb";
import { addDocument, getDocument, getDocuments } from "../helpers/dbHelper.js";
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
