import rateLimit from "express-rate-limit";

/**
 * Rate limiter for cart creation
 * Restricts users to 15 cart creation requests per hour
 * This prevents abuse of cart creation endpoint
 */
export const createCartLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 15, // 15 requests per hour
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
export const retrieveUserPendingCartDetailsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute
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
  limit: 20, // 20 requests per minute
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
  limit: 20, // 20 requests per minute
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
  limit: 30, // 30 requests per minute
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
  limit: 10, // 10 requests per hour
  message: {
    message: "Too many cart deletion attempts. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for cart status modification
 * Restricts users to 15 status updates per 15 mins
 * This prevents abuse of cart status changes
 */
export const modifyCartStatusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  limit: 15, // 15 requests per 15 mins
  message: {
    message:
      "Too many cart status update attempts. Please try again after 15 mins.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for retrieving user's confirmed and waiting carts
 * Allows frequent reads with 50 requests per minute
 * Higher limit since users may check their order status frequently
 */
export const retrieveUserOnlinePaidAndWaitingCartsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 50, // 50 requests per minute
  message: {
    message:
      "Too many cart status retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for admin cart status modification
 * Restricts admin to 50 status updates per 5 mins
 * This prevents abuse of cart status changes
 */
export const adminModifyCartStatusLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  limit: 50, // 50 requests per 5 mins
  message: {
    message:
      "Too many cart status update attempts. Please try again after 5 mins.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for cart payment type modification
 * Restricts user to 20 payment type updates per 5 mins
 * This prevents abuse of cart payment type changes
 */
export const modifyCartPaymentTypeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  limit: 20, // 20 requests per 5 mins
  message: {
    message:
      "Too many cart payment type update attempts. Please try again after 5 mins.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for admin to retrieve all users' carts
 * Restricts admin to 30 requests per 5 minutes to prevent system overload
 * More permissive for admin operations but still controlled
 */
export const retrieveAllUsersCartsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 30, // 30 requests per 5 minutes
  message: {
    message:
      "Too many cart retrieval attempts. Please try again after 5 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});
