import { addOrderData } from "../services/orderServices.js";
import { sendResponse } from "./responseHelper.js";
import {
  fetchAggregatedCartData,
  removeCartData,
} from "../services/cartServices.js";
import { fetchUserDataFromReq } from "../services/userServices.js";
import { addPaymentData } from "../services/paymentServices.js";

export const PAYMENT_METHODS = {
  0: { id: 0, method: "Cash on Delivery" },
  1: { id: 1, method: "Razorpay" },
  2: { id: 2, method: "PayPal" },
};

export const PAYMENT_STATUSES = {
  0: { id: 0, status: "Pending" },
  1: { id: 1, status: "Paid" },
  2: { id: 2, status: "Failed" },
  3: { id: 3, status: "Refunded" },
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

export const buildOrderObject = (userId, address, cart, totalPrice) => {
  const order = {
    userId,
    address,
    items: cart.books.map(({ cartQuantity: quantity, bookId, price }) => ({
      quantity,
      bookId,
      price,
    })),
    totalPrice,
    orderStatus: ORDER_STATUSES[0],
    createdAt: new Date(),
  };

  return order;
};

export const sanitizeOrderQueryObject = (query) => {
  const { status, date } = query;

  let sanitizedStatus = null;
  let sanitizedDateRange = null;

  if (status && !isNaN(Number(status))) {
    sanitizedStatus = Number(status);
  }

  if (date) {
    const parsedDate = new Date(date);

    if (!isNaN(parsedDate.getTime())) {
      const start = new Date(parsedDate);
      const end = new Date(parsedDate);

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(24, 0, 0, 0);

      sanitizedDateRange = {
        $gte: start,
        $lt: end,
      };
    }
  }

  return {
    status: sanitizedStatus,
    dateRange: sanitizedDateRange,
  };
};

export const placeUserOrder = async (
  req,
  res,
  { userId, selectedAddress, paymentMethodId, totalPrice }
) => {
  try {
    // Fetch user and cart data
    const user = await fetchUserDataFromReq(req);
    const cart = await fetchAggregatedCartData(userId);

    // Full address object
    const addressObj = user.addresses.find(
      (addr) => addr._id === selectedAddress
    );

    if (!addressObj)
      return sendResponse(res, 404, "Selected address not found.", false);

    if (!cart.books || cart.books.length === 0)
      return sendResponse(
        res,
        400,
        "Your cart is empty. Add items before placing an order.",
        false
      );

    // Create order object
    const orderObject = buildOrderObject(userId, addressObj, cart, totalPrice);

    const { acknowledged: orderAcknowledged, insertedId: orderId } =
      await addOrderData(orderObject);

    if (!orderAcknowledged)
      return sendResponse(
        res,
        400,
        `Error placing order. Please try again later.`,
        false
      );

    // Create payment object
    const paymentObject = {
      orderId: orderId.toString(),
      paymentMethod: PAYMENT_METHODS[paymentMethodId],
      paymentStatus: PAYMENT_STATUSES[0],
      amount: totalPrice,
    };

    const { acknowledged: paymentAcknowledged } =
      await addPaymentData(paymentObject);

    if (!paymentAcknowledged)
      return sendResponse(
        res,
        400,
        `Error placing order. Please try again later.`,
        false
      );

    const { deletedCount } = await removeCartData({ userId });
    if (!deletedCount)
      return sendResponse(
        res,
        400,
        `Error placing order. Please try again later.`,
        false
      );

    return sendResponse(res, 200, "Order placed successfully.", true, {
      orderId,
      amount: totalPrice,
    });
  } catch (error) {
    console.error("Order placement failed:", error);
    return sendResponse(res, 500, "Internal server error.", false);
  }
};
