import { body } from "express-validator";
import mongoose from "mongoose";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Cart from "../../models/cartModel.js";
import PaymentOtp from "../../models/paymentOtpModel.js";

/**
 * Validation middleware for sending OTP
 *
 * Validates:
 * - cartId: Must be a valid MongoDB ObjectId
 * - Cart must exist and belong to the authenticated user
 * - Cart status must be "Pending" to proceed with payment
 */
export const sendPaymentOtpValidator = [
  body("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid cart ID format. Must be a valid MongoDB ObjectId")
    .bail()
    .custom(async (value, { req }) => {
      // Verify the cart exists and belongs to the authenticated user
      const cart = await Cart.findOne({
        _id: value,
        userId: req.user._id,
      });

      if (!cart) {
        throw new Error("Cart not found or does not belong to you");
      }

      // Verify cart status is Pending
      if (cart.status !== "Pending") {
        throw new Error(`Cannot send OTP for cart with status: ${cart.status}`);
      }

      // Check if OTP already exists and was recently sent
      const existingOtp = await PaymentOtp.findOne({ cartId: value });
      if (existingOtp) {
        const otpTime = new Date(existingOtp.updatedAt);

        // Calculate the time difference in milliseconds
        const timeDifference = Date.now() - otpTime.getTime();

        if (timeDifference < 2 * 60 * 1000) {
          throw new Error(
            "An OTP was already sent in the last 2 minutes. Please wait before requesting a new one."
          );
        }
      }

      return true;
    }),

  validatorMiddleware,
];

/**
 * Validation middleware for verifying OTP
 */
export const verifyPaymentOtpValidator = [
  body("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid cart ID format. Must be a valid MongoDB ObjectId")
    .bail()
    .custom(async (value, { req }) => {
      // Verify the cart exists and belongs to the authenticated user
      const cart = await Cart.findOne({
        _id: value,
        userId: req.user._id,
      });

      if (!cart) {
        throw new Error("Cart not found or does not belong to you");
      }

      return true;
    }),

  body("code")
    .notEmpty()
    .withMessage("OTP code is required")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP code must be exactly 6 digits")
    .bail()
    .isNumeric()
    .withMessage("OTP code must contain only numbers"),

  validatorMiddleware,
];
