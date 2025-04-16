import rateLimit from "express-rate-limit";

/**
 * Rate limiter for product creation endpoint
 * Limits requests to 10 per 1 minute per IP address
 */
export const createProductLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // 10 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message:
      "Too many product creation attempts. Please try again in 1 minutes.",
  },
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});

/**
 * Rate limiter for paginated products endpoint
 * Limits requests to 20 per 1 minute per IP address
 */
export const getPaginatedProductsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many products fetch attempts. Please try again in 1 minutes.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for product quantity update endpoint
 * Limits requests to 10 per 1 minute per IP address
 */
export const productQuantityUpdateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many product quantity update attempts. Please try again in 1 minutes.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for product quantity update endpoint
 * Limits requests to 10 per 1 minute per IP address
 */
export const productDeletionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many product deletion attempts. Please try again in 1 minutes.",
  },
  skipSuccessfulRequests: false,
});
