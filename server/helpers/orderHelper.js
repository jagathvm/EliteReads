export const buildOrderObject = (userId, address, cart, paymentMethod) => ({
  userId,
  address,
  items: cart.books.map(
    ({
      cartQuantity: quantity,
      bookId,
      title,
      author,
      bookSlug,
      coverImageUrl,
      price,
    }) => ({
      quantity,
      bookId,
      title,
      author,
      bookSlug,
      coverImageUrl,
      price,
    })
  ),
  totalPrice: cart.books.reduce(
    (total, book) => total + book.price * book.cartQuantity,
    0
  ),
  paymentMethod,
  status: "pending",
  createdAt: new Date(),
});
