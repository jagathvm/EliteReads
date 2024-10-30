import { getCategoriesCollection } from "../config/db.js";
import {
  getAggregatedDocuments,
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
  removeDocument,
} from "./dbServices.js";

// Category-specific functions
const getAggregatedCategories = async (pipeline) =>
  await getAggregatedDocuments(
    pipeline,
    getCategoriesCollection,
    "Error retrieving categories."
  );

const getCategories = async (query) =>
  await getDocuments(
    query,
    getCategoriesCollection,
    "Error retrieving categories."
  );

const getCategory = async (query) =>
  await getDocument(query, getCategoriesCollection, "Category Not Found.");
const addCategory = async (category) =>
  await addDocument(category, getCategoriesCollection);
const updateCategory = async (query, operation) =>
  await updateDocument(query, operation, getCategoriesCollection);
const removeCategory = async (query) =>
  await removeDocument(query, getCategoriesCollection);

export {
  getAggregatedCategories,
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
};
