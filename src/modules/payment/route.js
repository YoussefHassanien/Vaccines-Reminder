import express from "express";
import {
  sendPaymentOtp,
  verifyPaymentOtp,
  resendPaymentOtp,
} from "./controller.js";
import {
  sendPaymentOtpValidator,
  verifyPaymentOtpValidator,
  resendPaymentOtpValidator,
} from "./validation.js";
import {
  sendOtpLimiter,
  verifyOtpLimiter,
  resendOtpLimiter,
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

export default paymentRouter;
