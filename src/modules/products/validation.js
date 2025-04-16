import { body, validationResult } from "express-validator";

/**
 * Product validation middleware
 *
 * Sanitizes product data:
 * - name: escaped for XSS protection
 * - description: escaped for XSS protection
 *
 * Returns 400 error with validation details if validation fails
 */
export const validateProduct = [
  body("name").trim().escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), messagae: "XSS Attempt!" });
    }
    next();
  },
];

/**
 * Check if a value is a valid non-empty string
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a valid non-empty string, false otherwise
 */
export const isValidString = (value) => {
  return typeof value === "string" && value.trim() !== "";
};

/**
 * Check if a value is an integer
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is an integer, false otherwise
 */
export const isInteger = (value) => {
  return typeof value === "number" && Number.isInteger(value);
};
