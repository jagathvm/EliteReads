export const PAYMENT_METHODS = {
  0: { id: 0, method: "Cash on Delivery" },
  1: { id: 1, method: "UPI" },
  2: { id: 2, method: "Net Banking" },
  3: { id: 3, method: "Card" },
};

export const ORDER_STATUSES = {
  0: { id: 0, status: "Pending" },
  1: { id: 1, status: "Confirmed" },
  2: { id: 2, status: "Processing" },
  3: { id: 3, status: "Shipped" },
  4: { id: 4, status: "Out for Delivery" },
  5: { id: 5, status: "Delivered" },
  6: { id: 6, status: "Cancelled" },
  7: { id: 7, status: "Returned" },
  8: { id: 8, status: "Refunded" },
};

export const buildOrderObject = (userId, address, cart, paymentMethodId) => ({
  userId,
  address,
  items: cart.books.map(({ cartQuantity: quantity, bookId, price }) => ({
    quantity,
    bookId,
    price,
  })),
  totalPrice: cart.books.reduce(
    (total, book) => total + book.price * book.cartQuantity,
    0
  ),
  paymentMethod: PAYMENT_METHODS[paymentMethodId],
  orderStatus: ORDER_STATUSES[0],
  createdAt: new Date(),
});
