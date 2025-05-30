import rateLimit from "express-rate-limit";

// Rate limiter for creating product reviews
export const createProductReviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 10, // Limit each IP to 10 review creation requests per windowMs
  message: {
    message:
      "Too many review creation attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
});
