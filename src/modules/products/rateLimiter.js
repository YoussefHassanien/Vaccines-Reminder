import rateLimit from "express-rate-limit";

/**
 * Rate limiter for product creation endpoint
 * Limits requests to 10 per 15 minutes per IP address
 */
export const createProductLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // 10 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message:
      "Too many product creation attempts. Please try again in 1 minutes.",
  },
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});
