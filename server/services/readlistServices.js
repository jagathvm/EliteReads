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
