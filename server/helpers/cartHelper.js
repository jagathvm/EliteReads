import { ObjectId } from "mongodb";

export const buildCartObject = (userId, bookId) => {
  return {
    userId,
    books: [
      {
        bookId: new ObjectId(bookId),
        cartQuantity: 1,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateCartObject = (cart, bookId) => {
  cart.books.push({
    bookId: new ObjectId(bookId),
    cartQuantity: 1,
  });
  cart.updatedAt = new Date();

  return cart;
};
