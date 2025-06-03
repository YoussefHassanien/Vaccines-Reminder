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

/**
 * Rate limiter for fetching all providers
 * Limits requests to 100 per 5 minutes per IP address
 */
export const fetchAllProvidersLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message:
      "Too many fetching all providers attempts, Try again after 5 minutes.",
  },
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});

/**
 * Rate limiter for fetching a provider by ID
 * Limits requests to 50 per 5 minutes per IP address
 */
export const fetchProviderByIdLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    message:
      "Too many fetching provider by ID attempts, Try again after 5 minutes.",
  },
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});
