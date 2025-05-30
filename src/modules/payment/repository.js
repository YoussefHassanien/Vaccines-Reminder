import PaymentOtp from "../../models/paymentOtpModel.js";
import Cart from "../../models/cartModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";
import mongoose from "mongoose";
import CartProduct from "../../models/cartProductModel.js";

/**
 * Creates a new payment OTP in the database
 *
 * @param {Object} paymentOtpData - Data for the payment OTP
 * @returns {Promise<boolean>} Promise of true on successful adding otp
 */
export const addPaymentOtp = async (paymentOtpData) => {
  try {
    const paymentOtp = new PaymentOtp(paymentOtpData);
    await paymentOtp.save();
    return true;
  } catch (error) {
    console.error("Error inserting payment OTP:", error);
    throw error;
  }
};

/**
 * Deletes a payment OTP by ID
 *
 * @param {string} id - ID of the payment OTP
 * @returns {boolean} true on successful deletion
 */
export const deletePaymentOtp = async (id) => {
  try {
    const deletedPaymentOtp = await PaymentOtp.findByIdAndDelete(id);

    if (!deletedPaymentOtp) {
      console.error("Payment OTP not found!");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting payment OTP:", error);
    throw error;
  }
};

export const getPaymentOtpByCartId = async (cartId) => {
  try {
    const paymentOtp = await PaymentOtp.findOne({ cartId });
    return paymentOtp;
  } catch (error) {
    console.error(`Error finding payment otp of cart id: ${cartId}`, error);
    throw error;
  }
};

export const updateUserCartStatus = async (userId, cartId) => {
  try {
    const userCart = await Cart.findOne({ userId, _id: cartId });
    if (!userCart) {
      console.error(
        `User cart of user id: ${userId} and cart id: ${cartId} not found!`
      );
      return false;
    }
    if (userCart.status === "Pending" && userCart.paymentType === "Online") {
      userCart.status = "Online Paid";
      await userCart.save();
      const formattedUserCart = formatMongoDbObjects(userCart);
      return formattedUserCart;
    }
    console.log(
      `User cart of user id: ${userId} and cart id: ${cartId} status is not pending or not an online payment cart`
    );
    return false;
  } catch (error) {
    console.error(
      `Error updating user cart of user id: ${userId} and cart id: ${cartId}`,
      error
    );
    throw error;
  }
};

/**
 * Updates the OTP code for a specific cart
 *
 * @param {string} cartId - ID of the cart
 * @param {string} code - New OTP code
 * @returns {Object|boolean} Updated payment OTP object or false if not found
 */
export const updatePaymentOtpCode = async (cartId, code) => {
  try {
    const paymentOtp = await PaymentOtp.findOne({ cartId });

    if (!paymentOtp) {
      console.error(`No payment OTP found for cart ID: ${cartId}`);
      return false;
    }

    paymentOtp.code = code;
    paymentOtp.save();

    // If you use the formatMongoDbObjects utility for other functions
    return formatMongoDbObjects(paymentOtp);
  } catch (error) {
    console.error(`Error updating payment OTP for cart ID: ${cartId}`, error);
    throw error;
  }
};

/**
 * Deletes a cart and its associated products
 *
 * @param {string} cartId - ID of the cart to delete
 * @param {string} userId - ID of the user who owns the cart
 * @returns {Promise<Object>} Deleted cart data or false if not found
 */
export const deleteCartAndProducts = async (cartId, userId) => {
  try {
    // First verify the cart exists and belongs to the user
    const cart = await Cart.findOne({ _id: cartId, userId });

    if (!cart) {
      console.error(`Cart with ID ${cartId} not found for user ${userId}`);
      return false;
    }

    // Cannot cancel a cart that is already confirmed
    if (cart.status !== "Pending") {
      console.error(`Cannot cancel cart with status: ${cart.status}`);
      return false;
    }

    // Use a session to ensure both operations succeed or fail together
    const session = await mongoose.startSession();
    let deletedCart;

    try {
      session.startTransaction();

      // Delete cart products first
      await CartProduct.deleteMany({ cartId }, { session });

      // Then delete the cart itself
      deletedCart = await Cart.findByIdAndDelete(cartId).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return formatMongoDbObjects(deletedCart);
  } catch (error) {
    console.error(`Error deleting cart ${cartId}:`, error);
    throw error;
  }
};
