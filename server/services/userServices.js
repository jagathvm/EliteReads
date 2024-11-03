import { getUserCollection } from "../config/db.js";
import {
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
} from "../helpers/dbHelper.js";

// User-specific functions
const getUsers = async (query) =>
  await getDocuments(query, getUserCollection, "Error retrieving users.");
const getUser = async (query) =>
  await getDocument(query, getUserCollection, "User not found.");
const addUser = async (user) => await addDocument(user, getUserCollection);
const updateUser = async (query, operation) =>
  await updateDocument(query, operation, getUserCollection);

export { getUsers, getUser, addUser, updateUser };
