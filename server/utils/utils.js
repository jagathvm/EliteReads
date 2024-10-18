import { ObjectId } from "mongodb";
import { getSubcategories } from "../services/dbServices.js";

const capitalisation = (data) => {
  return data
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
};

const attachSubCategoriesToCategories = async (categories) => {
  for (let category of categories) {
    if (category.subCategories && category.subCategories.length > 0) {
      const subCategoryIds = category.subCategories.map(
        (id) => new ObjectId(id)
      );

      const { value: subCategories } = await getSubcategories({
        _id: { $in: subCategoryIds },
      });

      // Attach subcategory details to each category
      category.subCategories = subCategories;
    } else {
      // Handle case where there are no subcategories
      category.subCategories = [];
    }
  }
};

const slugWithIsbn = (book) => {
  const { title, isbn } = book;
  const slug = title
    .trim()
    .toLowerCase()
    // Remove apostrophes specifically without replacing them with a dash
    .replace(/'/g, "")
    // Replace other non-alphanumeric characters with dashes
    .replace(/[^a-z0-9]+/g, "-")
    // Remove leading or trailing dashes
    .replace(/^-|-$/g, "");
  const slugWithIsbn = `${slug}-${isbn}`;

  return slugWithIsbn;
};

const getCheckboxValue = (checkbox) => checkbox === "on";

export {
  attachSubCategoriesToCategories,
  capitalisation,
  getCheckboxValue,
  slugWithIsbn,
};
