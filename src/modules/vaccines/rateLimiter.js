import rateLimit from "express-rate-limit";

/**
 * Rate limiter for vaccine creation
 * Restricts providers to 15 vaccine creation requests per 5 minutes
 * This prevents abuse of vaccine creation endpoint
 */
export const createVaccineLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // 15 requests per hour
  message: {
    message:
      "Too many vaccine creation attempts. Please try again after an hour.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});

/**
 * Rate limiter for retrieving vaccines for parents
 * Allows more frequent reads with 30 requests per minute
 * Higher limit because this is likely a public endpoint with high traffic
 */
export const retrieveVaccinesForParentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    message:
      "Too many vaccine retrieval attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
