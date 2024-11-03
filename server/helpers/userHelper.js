import { ObjectId } from "mongodb";
import { getUser } from "../services/userServices.js";

// User-specific functions
const fetchUserData = async (req) => {
  if (req.user) {
    const { value: user } = await getUser({
      _id: new ObjectId(req.user.userId),
    });
    return user;
  }
  return null;
};

const slugWithIsbn = (title, isbn) => {
  const slug = title
    .trim()
    .toLowerCase()
    // Remove apostrophes specifically without replacing them with a dash
    .replace(/'/g, "")
    // Replace other non-alphanumeric characters with dashes
    .replace(/[^a-z0-9]+/g, "-")
    // Remove leading or trailing dashes
    .replace(/^-|-$/g, "");

  return `${slug}-${isbn}`;
};

export { fetchUserData, slugWithIsbn };
