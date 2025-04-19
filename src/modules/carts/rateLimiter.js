import rateLimit from "express-rate-limit";

/**
 * Rate limiter for cart creation
 * Limits to 5 cart creation requests per 1-minute window per IP
 * Helps prevent abuse, brute force attempts, and DoS attacks
 */
export const createCartLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // 5 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: "Too many cart creation attempts. Please try again later.",
  },
  skipSuccessfulRequests: false, // Count all requests against the rate limit
});
