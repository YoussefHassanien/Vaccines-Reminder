import express from "express";
import { sendPaymentOtp } from "./controller.js";
import { sendPaymentOtpValidator } from "./validation.js";
import { sendOtpLimiter } from "./rateLimiter.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

const paymentOtpRouter = express.Router();

paymentOtpRouter.post(
  "/send-otp",
  sendOtpLimiter,
  isAuthenticated,
  sendPaymentOtpValidator,
  sendPaymentOtp
);

export default paymentOtpRouter;
