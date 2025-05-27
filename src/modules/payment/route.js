import express from "express";
import {
  sendPaymentOtp,
  verifyPaymentOtp,
  resendPaymentOtp,
  cancelPayment,
} from "./controller.js";
import {
  sendPaymentOtpValidator,
  verifyPaymentOtpValidator,
  resendPaymentOtpValidator,
  cancelPaymentValidator,
} from "./validation.js";
import {
  sendOtpLimiter,
  verifyOtpLimiter,
  resendOtpLimiter,
  cancelPaymentLimiter,
} from "./rateLimiter.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

const paymentRouter = express.Router();

paymentRouter.get(
  "/send-otp/:cartId",
  sendOtpLimiter,
  isAuthenticated,
  sendPaymentOtpValidator,
  sendPaymentOtp
);

paymentRouter.post(
  "/verify-otp",
  verifyOtpLimiter,
  isAuthenticated,
  verifyPaymentOtpValidator,
  verifyPaymentOtp
);

paymentRouter.patch(
  "/resend-otp/:cartId",
  resendOtpLimiter,
  isAuthenticated,
  resendPaymentOtpValidator,
  resendPaymentOtp
);

paymentRouter.delete(
  "/cancel/:cartId",
  cancelPaymentLimiter,
  isAuthenticated,
  cancelPaymentValidator,
  cancelPayment
);

export default paymentRouter;
