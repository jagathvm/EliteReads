import { getPaymentsCollection } from "../config/db.js";
import { addDocument, updateDocument } from "../helpers/dbHelper.js";

export const addPaymentData = async (payment) => {
  try {
    const insertResult = await addDocument(payment, getPaymentsCollection);

    return insertResult;
  } catch (error) {
    console.error("Error adding payment", error);
    throw error;
  }
};

export const updatePaymentData = async (query, operation) => {
  try {
    const updateResult = await updateDocument(
      query,
      operation,
      getPaymentsCollection
    );

    return updateResult;
  } catch (error) {
    console.error("Error updating payment", error);
    throw error;
  }
};
