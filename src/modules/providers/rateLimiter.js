import rateLimit from "express-rate-limit";

/**
 * Rate limiter for adding new providers
 * Limits requests to 20 per 5 minutes per IP address
 */
export const addNewProviderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    message:
      "Too many adding new providers attempts, Try again after 5 minutes.",
  },
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});
