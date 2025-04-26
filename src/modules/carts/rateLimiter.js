import rateLimit from "express-rate-limit";

/**
 * Rate limiter for cart creation
 * Restricts users to 5 cart creation requests per hour
 * This prevents abuse of cart creation endpoint
 */
export const createCartLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 5 requests per hour
  message: {
    message: "Too many cart creation attempts. Please try again after an hour.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter for retrieving cart details
 * Allows more frequent reads with 60 requests per minute
 */
export const retrieveUserCartDetailsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    message:
      "Too many cart retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for adding products to cart
 * Restricts users to 20 product additions per minute
 * Balances between usability and security
 */
export const createCartProductLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    message:
      "Too many product addition attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for removing products from cart
 * Restricts users to 20 product removals per minute
 */
export const eraseCartProductLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    message:
      "Too many product removal attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for updating product quantities
 * Restricts users to 30 quantity updates per minute
 * Slightly more permissive than add/remove operations
 */
export const modifyCartProductQuantityLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    message:
      "Too many quantity update attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for cart deletion
 * More restrictive with 10 deletion requests per hour
 * Protects against malicious cart deletion
 */
export const eraseCartLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    message: "Too many cart deletion attempts. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
