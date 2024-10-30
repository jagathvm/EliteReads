import { ObjectId } from "mongodb";

const capitalisation = (data) => {
  return data
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
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
  const slugWithIsbn = `${slug}-${isbn}`;

  return slugWithIsbn;
};

const getCheckboxValue = (checkbox) => checkbox === "on";

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

export { capitalisation, getCheckboxValue, slugWithIsbn, formatDate };
