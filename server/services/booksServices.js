import { getBooksCollection } from "../config/db.js";
import {
  getAggregatedDocuments,
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
  removeDocument,
} from "./dbServices.js";

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

export {
  getAggregatedBooks,
  getBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
};
