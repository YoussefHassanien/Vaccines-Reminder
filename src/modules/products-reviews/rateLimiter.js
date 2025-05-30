import rateLimit from "express-rate-limit";

// Rate limiter for creating product reviews
export const createProductReviewLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // Limit each IP to 10 review creation requests per windowMs
  message: {
    message:
      "Too many review creation attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
});

// Rate limiter for deleting product reviews
export const eraseProductReviewLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 15, // Limit each IP to 15 review deletion requests per windowMs
  message: {
    message:
      "Too many review deletion attempts. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
