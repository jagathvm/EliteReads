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

export const getBooksCollection = async () => await getCollection("books");
export const getCategoriesCollection = async () =>
  await getCollection("categories");
export const getUserCollection = async () => await getCollection("user");
export const getReadlistCollection = async () =>
  await getCollection("readlist");
export const getCartCollection = async () => await getCollection("cart");
export const getOrdersCollection = async () => await getCollection("orders");
export const getPaymentsCollection = async () =>
  await getCollection("payments");
