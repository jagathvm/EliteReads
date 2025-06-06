export const createSlug = (title) => {
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

export const sentenceCase = (str) => {
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

export const capitalisation = (data) => {
  return data
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
};

export const formatDate = (date) => {
  const fullDate = new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const monthYear = new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
  });

  return { fullDate, monthYear };
};
