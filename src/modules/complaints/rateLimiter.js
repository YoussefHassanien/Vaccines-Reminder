import rateLimit from "express-rate-limit";

/**
 * Rate limiter for complaint creation
 * Restricts users to 10 complaint submissions per 5 minutes
 * This prevents abuse of the complaint endpoint while allowing legitimate complaints
 */
export const createComplaintLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    message:
      "Too many complaint submissions. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});

/**
 * Rate limiter for retrieving complaints
 * Restricts to 30 requests per minute
 * This is an administrative endpoint, so we limit access to prevent excessive load
 */
export const retrieveComplaintsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    message:
      "Too many complaint retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
