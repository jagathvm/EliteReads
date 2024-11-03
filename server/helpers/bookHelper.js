import { getAggregatedBooks } from "../services/booksServices.js";

const fetchBookData = async (bookSlug) => {
  try {
    const bookPipeline = [
      {
        $match: {
          bookSlug,
        },
      },
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

    const {
      value: [book],
    } = await getAggregatedBooks(bookPipeline);
    return book;
  } catch (error) {
    console.error(`Error fetching book: ${error}`);
    return null;
  }
};

const fetchBooksData = async () => {
  try {
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

    const { value: books } = await getAggregatedBooks(booksPipeline);
    return books;
  } catch (error) {
    console.error(`Error fetching books: ${error}`);
    return null;
  }
};

export { fetchBookData, fetchBooksData };
