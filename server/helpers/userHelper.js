import { ObjectId } from "mongodb";
import { getUsers, getUser } from "../services/userServices.js";

// User-specific functions

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

const createSlug = (title) => {
  return (
    title
      .trim()
      .toLowerCase()
      // Remove apostrophes specifically without replacing them with a dash
      .replace(/'/g, "")
      // Replace other non-alphanumeric characters with dashes
      .replace(/[^a-z0-9]+/g, "-")
      // Remove leading or trailing dashes
      .replace(/^-|-$/g, "")
  );
};

export { fetchUsersData, fetchUserData, fetchUserDataFromReq, createSlug };
