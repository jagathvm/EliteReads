import { ObjectId } from "mongodb";
import { getBooksCollection } from "../config/db.js";
import {
  getAggregatedDocuments,
  getDocumentsCount,
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
  removeDocument,
} from "../helpers/dbHelper.js";
import { fetchCategoryIdsBySlug } from "./categoriesServices.js";

// Utility Constants
const bookPipeline = [
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $unwind: {
      path: "$category",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "subcategory",
      foreignField: "_id",
      as: "subcategory",
    },
  },
  {
    $unwind: {
      path: "$subcategory",
      preserveNullAndEmptyArrays: true,
    },
  },
];

const booksPipeline = [
  {
    $project: {
      author: 1,
      title: 1,
      price: 1,
      language: 1,
      publisher: 1,
      coverImageUrls: 1,
      category: 1,
      subcategory: 1,
      bookSlug: 1,
    },
  },
];

const priceRanges = {
  "under-100": { price: { $lt: 100 } },
  "100-200": { price: { $gte: 100, $lt: 200 } },
  "200-500": { price: { $gte: 200, $lt: 500 } },
  "500-1000": { price: { $gte: 500, $lt: 1000 } },
  "over-1000": { price: { $gte: 1000 } },
};

const sortOptions = {
  featured: { featured: -1 },
  titleAsc: { title: 1 },
  titleDesc: { title: -1 },
  priceAsc: { price: 1 },
  priceDesc: { price: -1 },
  releaseDate: { year: 1 },
};

// Helper functions
const parseCommaSeparatedValues = (value) => value.split(",").filter(Boolean);

export const sanitizeQuery = async (query) => {
  const sanitizedQuery = {};

  sanitizedQuery.sort = query.sort ? sortOptions[query.sort] : { title: 1 };
  sanitizedQuery.page = parseInt(query.page) || 1;
  sanitizedQuery.limit = parseInt(query.limit) || 9;

  if (query.price) {
    // Split comma-separated values
    const prices = parseCommaSeparatedValues(query.price);

    // Map selected price ranges to their corresponding filters
    const filters = prices
      // Map each range to its corresponding filter
      .map((range) => priceRanges[range])
      // Filter out empty filters;
      .filter((filter) => filter);

    // Add filters to the sanitized query
    sanitizedQuery["$or"] = filters;
  }

  if (query.category) {
    try {
      const categorySlugs = parseCommaSeparatedValues(query.category);
      sanitizedQuery.category = {
        $in: await fetchCategoryIdsBySlug(categorySlugs),
      };
    } catch (error) {
      console.error(`Error sanitizing category query: ${error.message}`);
      throw error;
    }
  }

  if (query.subcategory) {
    try {
      const categorySlugs = parseCommaSeparatedValues(query.subcategory);
      sanitizedQuery.subcategory = {
        $in: await fetchCategoryIdsBySlug(categorySlugs),
      };
    } catch (error) {
      console.error(`Error sanitizing subcategory query: ${error.message}`);
      throw error;
    }
  }

  if (query.language) {
    sanitizedQuery.language = {
      $in: parseCommaSeparatedValues(query.language),
    };
  }

  if (query.authors) {
    sanitizedQuery.author = { $in: parseCommaSeparatedValues(query.authors) };
  }

  if (query.publisher) {
    sanitizedQuery.publisher = {
      $in: parseCommaSeparatedValues(query.publisher),
    };
  }

  return sanitizedQuery;
};

// Core CRUD Operations
export const addBook = async (book) => {
  try {
    const insertResult = await addDocument(book, getBooksCollection);

    return insertResult;
  } catch (error) {
    console.error(`Error adding book: ${error}`);
    throw error;
  }
};

export const getBooks = async (query = {}) => {
  try {
    const books = await getDocuments(
      query,
      getBooksCollection,
      "Error retrieving books."
    );

    return books;
  } catch (error) {
    console.error(`Error retrieving books: ${error}`);
    throw error;
  }
};

export const getBook = async (query) => {
  try {
    const book = await getDocument(
      query,
      getBooksCollection,
      "Book not found."
    );

    return book;
  } catch (error) {
    console.error(`Error retrieving book: ${error}`);
    throw error;
  }
};

export const updateBook = async (query, operation) => {
  try {
    const updateResult = await updateDocument(
      query,
      operation,
      getBooksCollection
    );

    return updateResult;
  } catch (error) {
    console.error(`Error updating book: ${error}`);
    throw error;
  }
};

export const removeBook = async (query) => {
  try {
    const deleteResult = await removeDocument(query, getBooksCollection);

    return deleteResult;
  } catch (error) {
    console.error(`Error deleting book: ${error}`);
    throw error;
  }
};

// Data aggregation and fetching
const getAggregatedBooks = async (pipeline) => {
  try {
    const books = await getAggregatedDocuments(
      pipeline,
      getBooksCollection,
      "Error retrieving books."
    );

    return books;
  } catch (error) {
    console.error(`Error retrieving books: ${error}`);
    throw error;
  }
};

export const fetchBooksDataFromReadlist = async (readlist) => {
  try {
    const booksIdStrings = readlist?.books;
    const booksIds = booksIdStrings?.map((id) => new ObjectId(id));

    const books = await getBooks({ _id: { $in: booksIds } });
    return books;
  } catch (error) {
    console.error("Error fetching books from readlist", error);
    throw error;
  }
};

export const fetchBooksData = async (categorySlug) => {
  const pipeline = [...booksPipeline];

  try {
    if (categorySlug) {
      try {
        const categoryIds = await fetchCategoryIdsBySlug([categorySlug]);

        if (categoryIds) {
          const categoryQuery = { $match: { category: { $in: categoryIds } } };
          pipeline.unshift(categoryQuery);
        }
      } catch (error) {
        console.error(`Error fetching category: ${error.message}`);
        throw error;
      }
    }

    const { value: books } = await getAggregatedBooks(pipeline);
    return books;
  } catch (error) {
    console.error(`Error fetching books: ${error.message}`);
    throw error;
  }
};

export const fetchBooksDataByFiltersAndSort = async (
  queryObject = null,
  sortObject = null,
  skipValue = null,
  limit = null
) => {
  const pipeline = [];

  if (queryObject) {
    pipeline.push({ $match: queryObject });
  }

  if (sortObject) {
    pipeline.push({ $sort: sortObject });
  }

  if (skipValue) {
    pipeline.push({ $skip: skipValue });
  }

  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push(...bookPipeline);

  try {
    const { value: books } = await getAggregatedBooks(pipeline);
    return books;
  } catch (error) {
    console.error("Error in fetchBooksDataByFiltersAndSort: ", error.message);
    throw error;
  }
};

export const fetchBookData = async (field, value) => {
  const pipeline = [{ $match: { [field]: value } }, ...bookPipeline];

  try {
    const { value: book } = await getAggregatedBooks(pipeline);
    return book?.[0] || null;
  } catch (error) {
    console.error(`Error fetching book by ${field}: ${error}`);
    throw error;
  }
};

export const fetchBookDataById = async (id) =>
  await fetchBookData("_id", new ObjectId(id));
export const fetchBookDataBySlug = async (bookSlug) =>
  await fetchBookData("bookSlug", bookSlug);
export const fetchBookDataByTitle = async (title) =>
  await fetchBookData("title", title);
export const fetchBookDataByIsbn = async (isbn) =>
  await fetchBookData("isbn", isbn);

// Additional functionalities
export const fetchBooksCount = async (queryObject = {}) => {
  try {
    const booksCount = await getDocumentsCount(queryObject, getBooksCollection);

    return booksCount;
  } catch (error) {
    console.error(
      `Error fetching books count: ${error.message},
      queryObject: ${queryObject}`
    );
    throw error;
  }
};

export const fetchUniqueValuesFromBooksData = (field, booksData) => {
  try {
    const uniqueValues = [
      ...new Set(booksData.map((book) => book[field]).filter(Boolean)),
    ];
    return uniqueValues;
  } catch (error) {
    console.error(`Error fetching books unique values: ${error}`);
    throw error;
  }
};
