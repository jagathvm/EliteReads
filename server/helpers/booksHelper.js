import { getAggregatedBooks } from "../services/booksServices.js";

const booksPipeline = [
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $unwind: {
      path: "$category",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "subcategory",
      foreignField: "_id",
      as: "subcategory",
    },
  },
  {
    $unwind: {
      path: "$subcategory",
      preserveNullAndEmptyArrays: true,
    },
  },
];

const fetchBooksData = async (categorySlug) => {
  try {
    if (categorySlug) {
      booksPipeline.push({
        $match: {
          "category.slug": categorySlug,
        },
      });
    }

    // console.log(`booksPipeline: `);
    // console.log(booksPipeline);
    const { value: books } = await getAggregatedBooks(booksPipeline);

    if (categorySlug) {
      booksPipeline.pop();
    }

    return books;
  } catch (error) {
    console.error(`Error fetching books: ${error}`);
    return null;
  }
};

const fetchBookData = async (bookSlug) => {
  try {
    booksPipeline.unshift({
      $match: {
        bookSlug,
      },
    });

    const {
      value: [book],
    } = await getAggregatedBooks(booksPipeline);
    booksPipeline.shift();

    return book;
  } catch (error) {
    console.error(`Error fetching book: ${error}`);
    return null;
  }
};

export { fetchBooksData, fetchBookData };