import { ObjectId } from "mongodb";

export const processCategoryData = (changedData) => {
  const updatedCategoryData = {};

  try {
    // Name of the category
    if (changedData.name && typeof changedData.name === "string") {
      updatedCategoryData.name = changedData.name.trim();
    }

    // Description of the category
    if (
      changedData.description &&
      typeof changedData.description === "string"
    ) {
      updatedCategoryData.description = changedData.description.trim();
    }

    // Parent Category (Optional)
    if (changedData.parentCategory !== undefined) {
      updatedCategoryData.parentCategory = changedData.parentCategory
        ? new ObjectId(changedData.parentCategory)
        : "";
    }
  } catch (error) {
    console.error("Error while processing the category data:", error);
    throw error;
  }

  return updatedCategoryData;
};
