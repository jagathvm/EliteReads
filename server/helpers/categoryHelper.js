import { getAggregatedCategories } from "../services/categoriesServices.js";

const fetchCategoriesData = async () => {
  try {
    const categoriesPipeline = [
      {
        $match: {
          parentCategory: "",
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

    const { value: categories } =
      await getAggregatedCategories(categoriesPipeline);
    return categories;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return null;
  }
};

export { fetchCategoriesData };
