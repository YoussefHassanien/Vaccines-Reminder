import rateLimit from "express-rate-limit";

/**
 * Rate limiter for signup endpoint
 * Limits requests to 5 per 10 minutes per IP address
 */
export const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many signup attempts. Please try again in 10 minutes.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for login endpoint
 * Limits requests to 10 per 5 minutes per IP address
 */
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again in 5 minutes.",
  },
  skipSuccessfulRequests: false,
});

/**
 * Optional: Rate limiter for password reset (if implemented)
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many password reset attempts. Please try again in 15 minutes.",
  },
  skipSuccessfulRequests: false,
});
