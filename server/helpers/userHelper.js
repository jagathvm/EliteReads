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

const sentenceCase = (str) => {
  // Trim any leading or trailing spaces
  str = str.trim();

  // Split the string by periods to handle each sentence individually
  let sentences = str.split(".");

  // Capitalize the first word of each sentence and remove extra spaces
  sentences = sentences.map((sentence) => {
    // Trim spaces and make the sentence lowercase
    sentence = sentence.trim().toLowerCase();

    // Capitalize the first letter of the sentence (if it's not empty)
    if (sentence.length > 0) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }
    return sentence;
  });

  // Join the sentences back together with a period and a space between them
  return sentences.join(". ").trim() + (str.endsWith(".") ? "." : "");
};

const capitalisation = (data) => {
  return data
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
};

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

export {
  fetchUsersData,
  fetchUserData,
  fetchUserDataFromReq,
  createSlug,
  capitalisation,
  sentenceCase,
  formatDate,
};
