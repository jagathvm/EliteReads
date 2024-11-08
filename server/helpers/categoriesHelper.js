import { getAggregatedCategories } from "../services/categoriesServices.js";

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

const fetchCategoriesData = async () => {
  try {
    categoriesPipeline.unshift({
      $match: {
        parentCategory: "",
      },
    });

    // console.log(`categoriesPipeline: `);
    // console.log(categoriesPipeline);
    const { value: categories } =
      await getAggregatedCategories(categoriesPipeline);
    categoriesPipeline.shift();

    return categories;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return null;
  }
};

const fetchCategoryData = async (slug) => {
  try {
    categoriesPipeline.unshift({
      $match: {
        slug: slug,
      },
    });

    // console.log(`categoryPipeline: `);
    // console.log(categoriesPipeline);
    const {
      value: [category],
    } = await getAggregatedCategories(categoriesPipeline);
    categoriesPipeline.shift();

    return category;
  } catch (error) {
    console.error(`Error fetching category: ${error}`);
    return null;
  }
};

export { fetchCategoriesData, fetchCategoryData };
