import rateLimit from "express-rate-limit";

/**
 * Rate limiter for vaccine creation
 * Restricts providers to 50 vaccine creation requests per 5 minutes
 * This prevents abuse of vaccine creation endpoint
 */
export const createVaccineLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutesS
  max: 50, // 50 requests per 5 minutes
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

/**
 * Rate limiter for vaccine deletion
 * Restricts admins to 10 vaccine deletion requests per 5 minutes
 * Stricter limit to prevent accidental mass deletion
 */
export const deleteVaccineLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    message:
      "Too many vaccine deletion attempts. Please try again after 5 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't skip counts for successful requests
});
