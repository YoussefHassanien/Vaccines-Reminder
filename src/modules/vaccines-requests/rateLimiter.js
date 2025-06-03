import rateLimit from "express-rate-limit";

/**
 * Rate limiter for vaccine request creation
 * Restricts users to 10 vaccine request submissions per 5 minutes
 * This prevents abuse of the vaccine request endpoint while allowing legitimate requests
 */
export const createVaccineRequestLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    message:
      "Too many vaccine request submissions. Please try again after 5 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});

/**
 * Rate limiter for retrieving vaccine requests
 * Restricts to 20 requests per minute
 * This is an administrative endpoint, so we limit access to prevent excessive load
 */
export const retrieveVaccineRequestsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    message:
      "Too many vaccine request retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for retrieving user vaccine requests
 * Restricts to 20 requests per minute
 * This is an administrative endpoint, so we limit access to prevent excessive load
 */
export const retrieveUserVaccineRequestsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    message:
      "Too many user vaccine request retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for vaccine request cancelation
 * Restricts users to 10 vaccine request cancelations per 5 minutes
 * This prevents abuse of the vaccine request cancelation endpoint while allowing legitimate requests
 */
export const cancelUserVaccineRequestLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    message:
      "Too many vaccine request cancelations. Please try again after 5 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});
