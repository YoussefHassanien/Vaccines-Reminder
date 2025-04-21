import rateLimit from "express-rate-limit";

/**
 * Rate limiter for sending OTPs
 * Limits requests to 3 per 5 minutes per IP address
 */
export const sendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    message: "Too many OTP requests. Please try again after 5 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});

/**
 * Rate limiter for verifying OTPs
 * Limits requests to 5 per 15 minutes per IP address
 * This helps prevent brute force attacks on OTP verification
 */
export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many verification attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});
