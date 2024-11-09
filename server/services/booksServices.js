import { getBooksCollection } from "../config/db.js";
import {
  getAggregatedDocuments,
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
  removeDocument,
} from "../helpers/dbHelper.js";

// Book-specific functions
const getAggregatedBooks = async (pipeline) =>
  await getAggregatedDocuments(
    pipeline,
    getBooksCollection,
    "Error retrieving books."
  );

const getBooks = async (query = {}) =>
  await getDocuments(query, getBooksCollection, "Error retrieving books.");

const getBook = async (query) =>
  await getDocument(query, getBooksCollection, "Book not found.");

const addBook = async (book) => await addDocument(book, getBooksCollection);

const updateBook = async (query, operation) =>
  await updateDocument(query, operation, getBooksCollection);

const removeBook = async (query) =>
  await removeDocument(query, getBooksCollection);

const booksPipeline = [
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

const fetchBooksData = async (categorySlug, sort) => {
  try {
    if (categorySlug) {
      booksPipeline.push({
        $match: {
          "category.slug": categorySlug,
        },
      });
    }

    if (sort === "featured") {
      booksPipeline.push({
        $match: {
          featured: true,
        },
      });
    }

    if (sort === "priceAsc") {
      booksPipeline.push({
        $sort: {
          price: 1,
        },
      });
    } else if (sort === "priceDesc") {
      booksPipeline.push({
        $sort: {
          price: -1,
        },
      });
    }

    if (sort === "releaseDate") {
      booksPipeline.push({
        $sort: {
          year: 1,
        },
      });
    }

    const { value: books } = await getAggregatedBooks(booksPipeline);

    if (categorySlug) {
      booksPipeline.pop();
    }

    if (sort === "featured") {
      booksPipeline.pop();
    }

    if (sort === "priceAsc" || sort === "priceDesc") {
      booksPipeline.pop();
    }

    if (sort === "releaseDate") {
      booksPipeline.pop();
    }

    return books;
  } catch (error) {
    console.error(`Error fetching books: ${error}`);
    return null;
  }
};

const fetchBookData = async (bookSlug) => {
  try {
    booksPipeline.unshift({
      $match: {
        bookSlug,
      },
    });

    const {
      value: [book],
    } = await getAggregatedBooks(booksPipeline);
    booksPipeline.shift();

    return book;
  } catch (error) {
    console.error(`Error fetching book: ${error}`);
    return null;
  }
};

// Export functions
export {
  fetchBookData,
  fetchBooksData,
  getAggregatedBooks,
  getBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
};
