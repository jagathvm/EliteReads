import { ObjectId } from "mongodb";
import { getCategoriesCollection } from "../config/db.js";
import {
  getAggregatedDocuments,
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
  removeDocument,
} from "../helpers/dbHelper.js";

// Utility variables
const parentCategoryFilter = { parentCategory: "" };
const categoriesPipeline = [
  {
    $lookup: {
      from: "categories",
      localField: "parentCategory",
      foreignField: "_id",
      as: "parentCategory",
    },
  },
  {
    $unwind: {
      path: "$parentCategory",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "parentCategory",
      as: "subCategories",
    },
  },
];

// Helper functions
const uniqueCategoryIds = (categoryIds) => {
  const uniqueIdStrings = [...new Set(categoryIds.map((id) => id.toString()))];
  const uniqueIds = uniqueIdStrings.map((id) => new ObjectId(id));

  return uniqueIds;
};

// Core CRUD Operations
const addCategory = async (category) => {
  try {
    const insertResult = await addDocument(category, getCategoriesCollection);

    return insertResult;
  } catch (error) {
    console.error(`Error adding category: ${error}`);
    throw error;
  }
};

const getCategories = async (query) => {
  try {
    const categories = await getDocuments(
      query,
      getCategoriesCollection,
      "Error retrieving categories."
    );

    return categories;
  } catch (error) {
    console.error(`Error retrieving categories: ${error}`);
    throw error;
  }
};

const getCategory = async (query) => {
  try {
    const category = await getDocument(
      query,
      getCategoriesCollection,
      "Category not found."
    );

    return category;
  } catch (error) {
    console.error(`Error retrieving category: ${error}`);
    throw error;
  }
};

const updateCategory = async (query, operation) => {
  try {
    const updateResult = await updateDocument(
      query,
      operation,
      getCategoriesCollection
    );

    return updateResult;
  } catch (error) {
    console.error(`Error updating category: ${error}`);
    throw error;
  }
};

const removeCategory = async (query) => {
  try {
    const deleteResult = await removeDocument(query, getCategoriesCollection);

    return deleteResult;
  } catch (error) {
    console.error(`Error deleting category: ${error}`);
    throw error;
  }
};

// Data aggregation and fetching
const getAggregatedCategories = async (pipeline) => {
  try {
    const categories = await getAggregatedDocuments(
      pipeline,
      getCategoriesCollection,
      "Error retrieving categories."
    );

    return categories;
  } catch (error) {
    console.error(`Error retrieving categories: ${error}`);
    throw error;
  }
};

const fetchCategoriesData = async (field, value) => {
  const pipeline = [...categoriesPipeline];
  pipeline.unshift({ $match: parentCategoryFilter });

  if (field && value) {
    pipeline.unshift({
      $match: {
        [field]: { $in: value },
      },
    });
  }

  try {
    const { value: categories } = await getAggregatedCategories(pipeline);
    return categories;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return null;
  }
};

const fetchCategoryData = async (field, value) => {
  const pipeline = [...categoriesPipeline];
  if (value) {
    pipeline.unshift({ $match: { [field]: value } });
  }

  try {
    const {
      value: [category],
    } = await getAggregatedCategories(pipeline);

    return category;
  } catch (error) {
    console.error(`Error fetching category: ${error}`);
    throw error;
  }
};

const fetchCategoriesDataByIds = async (ids) =>
  await fetchCategoriesData("_id", ids);

const fetchCategoriesDataBySlug = async (slugs) =>
  await fetchCategoriesData("slug", slugs);

const fetchCategoriesDataByName = async (names) =>
  await fetchCategoriesData("name", names);

const fetchCategoryDataBySlug = async (slug) =>
  await fetchCategoryData("slug", slug);

// Additional functionalities
const fetchCategoryIdsBySlug = async (slug) => {
  try {
    const { value: categories } = await getCategories({ slug: { $in: slug } });
    const categoryIds = categories.map((category) => category._id);

    return categoryIds;
  } catch (error) {
    console.error(`Error fetching category: ${error.message}`);
    throw error;
  }
};

export {
  fetchCategoryDataBySlug,
  fetchCategoriesData,
  fetchCategoriesDataByIds,
  fetchCategoriesDataBySlug,
  fetchCategoriesDataByName,
  fetchCategoryIdsBySlug,
  getAggregatedCategories,
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
  uniqueCategoryIds,
};
