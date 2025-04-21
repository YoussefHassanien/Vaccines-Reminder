import PaymentOtp from "../../models/paymentOtpModel.js";
import Cart from "../../models/cartModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

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
    const userCart = await Cart.findOne({ userId, cartId });
    if (!userCart) {
      console.error(
        `User cart of user id: ${userId} and cart id: ${cartId} not found!`
      );
      return false;
    }
    if (userCart.status === "Pending") {
      userCart.paymentType === "Online"
        ? (userCart.status = "Confirmed")
        : (userCart.status = "Waiting for cash payment");
      await userCart.save();
      const formattedUserCart = formatMongoDbObjects(userCart);
      return formattedUserCart;
    }
    console.log(
      `User cart of user id: ${userId} and cart id: ${cartId} status is not Pending!`
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
