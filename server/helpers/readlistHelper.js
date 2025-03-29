export const buildReadlistObject = (userId, bookId) => ({
  userId,
  books: [bookId],
  createdAt: new Date(),
});
