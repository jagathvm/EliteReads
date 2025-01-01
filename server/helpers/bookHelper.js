import { ObjectId } from "mongodb";
import { createSlug, sentenceCase } from "./stringHelper.js";

export const processBookData = (changedData) => {
  const updatedBookData = {};

  try {
    // Add the condition for `isbn` here to ensure it is processed
    if (changedData.isbn) {
      updatedBookData.isbn = parseInt(changedData.isbn); // Ensure that `isbn` is added to the updatedBookData
    }
    if (changedData.title && typeof changedData.title === "string") {
      updatedBookData.title = changedData.title.trim();
    }
    if (changedData.author && typeof changedData.author === "string") {
      updatedBookData.author = changedData.author.trim();
    }
    if (changedData.language && typeof changedData.language === "string") {
      updatedBookData.language = changedData.language.trim();
    }
    if (changedData.featured !== undefined) {
      updatedBookData.featured = changedData.featured === "true";
    }
    if (
      changedData.description &&
      typeof changedData.description === "string"
    ) {
      updatedBookData.description = sentenceCase(
        changedData.description.trim()
      );
    }
    if (changedData.price !== undefined) {
      updatedBookData.price = parseFloat(changedData.price);
    }
    if (changedData.publisher && typeof changedData.publisher === "string") {
      updatedBookData.publisher = changedData.publisher.trim();
    }
    if (changedData.year !== undefined) {
      updatedBookData.year = parseInt(changedData.year);
    }
    if (changedData.pages !== undefined) {
      updatedBookData.pages = parseInt(changedData.pages);
    }
    if (changedData.weight !== undefined) {
      updatedBookData.weight = parseFloat(changedData.weight);
    }
    if (changedData.category) {
      updatedBookData.category = new ObjectId(changedData.category);
    }
    if (changedData.subcategory) {
      updatedBookData.subcategory = new ObjectId(changedData.subcategory);
    }
  } catch (error) {
    console.error("Error while processing the book data:", error);
    throw error;
  }

  return updatedBookData;
};

export const buildBookObject = (validData, coverImageUrls) => {
  const {
    title,
    author: { firstName, lastName },
    description,
    price,
    isbn,
    publisher,
    year,
    language,
    pages,
    weight,
    featured,
    category,
    subcategory,
  } = validData;

  const bookSlug = `${createSlug(title)}-${isbn}`;

  return {
    title,
    author: `${firstName} ${lastName}`,
    description: sentenceCase(description),
    price: parseFloat(price),
    isbn: parseInt(isbn),
    publisher,
    year: parseInt(year),
    language,
    pages: parseInt(pages),
    weight: parseFloat(weight),
    featured: featured === "on" ? true : false,
    coverImageUrls,
    bookSlug,
    category: new ObjectId(category),
    subcategory: subcategory ? new ObjectId(subcategory) : "",
    quantity: 1,
  };
};
