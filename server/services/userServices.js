import { ObjectId } from "mongodb";
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

const fetchUsersData = async () => {
  try {
    const { value: users } = await getUsers();
    return users;
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    return null;
  }
};

const fetchUserData = async (username) => {
  try {
    const { value: user } = await getUser({ username });
    return user;
  } catch (error) {
    console.error(`Error fetching user: ${error}`);
    return null;
  }
};

const fetchUserDataFromReq = async (req) => {
  if (req.user) {
    const { value: user } = await getUser({
      _id: new ObjectId(req.user.userId),
    });
    return user;
  }
  return null;
};

export {
  fetchUsersData,
  fetchUserData,
  fetchUserDataFromReq,
  getUsers,
  getUser,
  addUser,
  updateUser,
};
