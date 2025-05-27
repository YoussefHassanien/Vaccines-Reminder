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
  skipSuccessfulRequests: false,
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
  skipSuccessfulRequests: false,
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
  skipSuccessfulRequests: false,
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
  skipSuccessfulRequests: false,
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
  skipSuccessfulRequests: false,
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
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for cart status modification
 * Restricts users to 10 status updates per hour
 * This prevents abuse of cart status changes
 */
export const modifyCartStatusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 15, // 15 requests per 15 mins
  message: {
    message:
      "Too many cart status update attempts. Please try again after 15 mins.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for retrieving user pending cart
 * Allows frequent reads with 100 requests per minute
 * Higher limit since this is a common operation for checking cart status
 */
export const retrieveUserPendingCartLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    message:
      "Too many pending cart retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for retrieving user's confirmed and waiting carts
 * Allows frequent reads with 50 requests per minute
 * Higher limit since users may check their order status frequently
 */
export const retrieveUserConfirmedAndWaitingCartsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute
  message: {
    message:
      "Too many cart status retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
=======
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
