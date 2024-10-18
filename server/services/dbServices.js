import {
  getAdminCollection,
  getBooksCollection,
  getCategoriesCollection,
  getSubcategoriesCollection,
  getUserCollection,
} from "../config/db.js";

// Initialize collections
const booksCollection = await getBooksCollection();
const categoriesCollection = await getCategoriesCollection();
const subCategoriesCollection = await getSubcategoriesCollection();
const userCollection = await getUserCollection();
const adminCollection = await getAdminCollection();

// Generic documents retrieval
const getDocuments = async (
  query = {},
  collection,
  errorMessage = "Error retrieving documents."
) => {
  try {
    let cursor = await collection.find(query);
    const documents = await cursor.toArray();

    if (!documents || documents.length === 0)
      return {
        found: false,
        errorMessage,
      };

    return { found: true, value: documents };
  } catch (error) {
    return {
      found: false,
      errorMessage: `Error retrieving documents: ${error.message}`,
    };
  }
};

// Generic document retrieval
const getDocument = async (
  query,
  collection,
  errorMessage = "Document not found."
) => {
  try {
    const document = await collection.findOne(query);
    if (!document)
      return {
        found: false,
        errorMessage,
      };

    return {
      found: true,
      value: document,
    };
  } catch (error) {
    return {
      found: false,
      errorMessage: `Error retrieving document: ${error.message}`,
    };
  }
};

// Generic document addition
const addDocument = async (document, collection) => {
  try {
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    throw new Error(`Error adding document: ${error.message}`);
  }
};

// Generic document updation
const updateDocument = async (query, operation, collection) => {
  try {
    const result = await collection.updateOne(query, operation);
    return result;
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

// Generic document deletion
const removeDocument = async (query, collection) => {
  try {
    const result = await collection.deleteOne(query);
    return result;
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

// Book-specific functions
const getBooks = async (query = {}) =>
  await getDocuments(query, booksCollection, "Error retrieving books.");
const getBook = async (query) =>
  await getDocument(query, booksCollection, "Book not found.");

const addBook = async (book) => await addDocument(book, booksCollection);

const updateBook = async (query, operation) =>
  await updateDocument(query, operation, booksCollection);

const removeBook = async (query) =>
  await removeDocument(query, booksCollection);

// Category-specific functions
const getCategories = async (query) =>
  await getDocuments(
    query,
    categoriesCollection,
    "Error retrieving categories."
  );

const getCategory = async (query) =>
  await getDocument(query, categoriesCollection, "Category Not Found.");

const addCategory = async (category) =>
  await addDocument(category, categoriesCollection);

const updateCategory = async (query, operation) =>
  await updateDocument(query, operation, categoriesCollection);

const removeCategory = async (query) =>
  await removeDocument(query, categoriesCollection);

// Subcategory-specific functions
const getSubcategories = async (query) =>
  await getDocuments(
    query,
    subCategoriesCollection,
    "Error retrieving subcategories."
  );

const getSubcategory = async (query) =>
  await getDocument(query, subCategoriesCollection, "Subcategory Not Found");

const addSubcategory = async (subCategory) =>
  await addDocument(subCategory, subCategoriesCollection);

const updateSubcategory = async (query, operation) =>
  await updateDocument(query, operation, subCategoriesCollection);

const removeSubcategory = async (query) =>
  await removeDocument(query, subCategoriesCollection);

// User-specific functions
const getUsers = async (query) =>
  await getDocuments(query, userCollection, "Error retrieving users.");

const getUser = async (query) =>
  await getDocument(query, userCollection, "User not found.");

const addUser = async (user) => await addDocument(user, userCollection);

// Admin-specific functions
const getAdmin = async (query) =>
  await getDocument(query, adminCollection, "Admin not found.");

export {
  getBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
  getSubcategories,
  getSubcategory,
  addSubcategory,
  updateSubcategory,
  removeSubcategory,
  getUsers,
  getUser,
  addUser,
  getAdmin,
};
