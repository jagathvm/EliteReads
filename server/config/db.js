import { MongoClient } from "mongodb";

let db;
const client = new MongoClient(process.env.MONGO_URI);

const connectToDB = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error(`Failed to connect to MongoDB: ${err}`);
      throw err;
    }
  }
  return db;
};

const getCollection = async (collectionName) => {
  if (!db) {
    await connectToDB();
  }
  return db.collection(collectionName);
};

const getAdminCollection = async () => await getCollection("admin");
const getBooksCollection = async () => await getCollection("books");
const getCategoriesCollection = async () => await getCollection("categories");
const getSubcategoriesCollection = async () =>
  await getCollection("subcategories");
const getUserCollection = async () => await getCollection("user");

export {
  getAdminCollection,
  getBooksCollection,
  getCategoriesCollection,
  getSubcategoriesCollection,
  getUserCollection,
};
