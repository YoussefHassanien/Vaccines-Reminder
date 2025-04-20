import { body, query, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

/**
 * Product validation middleware
 *
 * Validates and sanitizes product data:
 * - name: required, string, min length 2, max length 100, escaped for XSS protection
 * - description: required, string, min length 10, max length 1000, escaped for XSS protection
 * - price: required, positive number
 * - quantity: required, positive integer
 * - features: required, array, each feature must be a string between 3 and 500 characters
 * - requiredAge: required, string, min length 5, max length 30
 *
 * Returns 400 error with validation details if validation fails
 */
export const createProductValidator = [
  // Name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .bail()
    .escape(),

  // Description validation
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .bail()
    .isLength({ min: 20, max: 1000 })
    .withMessage("Description must be between 20 and 1000 characters")
    .bail()
    .escape(),

  // Price validation
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 1 })
    .withMessage("Price must be a positive number"),

  // Quantity validation
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  // Features validation
  body("features")
    .notEmpty()
    .withMessage("Features are required")
    .bail()
    .isArray()
    .withMessage("Features must be an array")
    .bail()
    .customSanitizer((value) => {
      // Trim and escape each feature if it's a string
      if (!Array.isArray(value)) return value;

      return value.map((feature) => {
        if (typeof feature === "string") {
          // First trim the string
          const trimmed = feature.trim();
          // Then escape it for XSS protection
          // This replaces <, >, &, ', " and / with HTML entities
          return trimmed
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");
        }
        return feature;
      });
    })
    .custom((value) => {
      if (value.length < 1) {
        return Promise.reject("Product must have at least one feature");
      }
      if (value.length > 10) {
        return Promise.reject("Product can have maximum 10 features");
      }

      // Check each feature length
      for (const feature of value) {
        if (typeof feature !== "string") {
          return Promise.reject("Each feature must be a string");
        }
        if (feature.length < 3 || feature.length > 500) {
          return Promise.reject(
            "Each feature must be between 3 and 500 characters"
          );
        }
      }

      return true;
    }),

  // RequiredAge validation
  body("requiredAge")
    .trim()
    .notEmpty()
    .withMessage("Required age information is required")
    .bail()
    .isString()
    .withMessage("Required age must be a string")
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage("Required age must be between 5 and 30 characters")
    .bail()
    .escape(),

  validatorMiddleware,
];

/**
 * Pagination validation middleware
 *
 * Validates and sanitizes pagination query parameters:
 * - cursor: optional, string, valid MongoDB ObjectId
 * - limit: optional, integer, minimum value 1, maximum value 100
 *
 * Returns 400 error with validation details if validation fails
 */
export const getPaginatedProductsValidator = [
  // Cursor validation
  query("cursor")
    .optional()
    .isMongoId()
    .withMessage("Cursor must be a valid MongoDB ObjectId"),

  // Limit validation
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a positive integer between 1 and 100"),

  validatorMiddleware,
];

/**
 * Update Product Quantity Validation Middleware
 *
 * Validates and sanitizes:
 * - id: required, valid MongoDB ObjectId
 * - quantity: required, positive integer
 *
 * Returns 400 error with validation details if validation fails
 */
export const productQuantityUpdateValidator = [
  // Validate the `id` parameter
  param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid Product ID format"),

  // Validate the `quantity` field
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  validatorMiddleware,
];

/**
 * Product Deletion Validation Middleware
 *
 * Validates and sanitizes:
 * - id: required, valid MongoDB ObjectId
 *
 * Returns 400 error with validation details if validation fails
 */
export const productDeletionValidator = [
  // Validate the `id` parameter
  param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid Product ID format"),

  validatorMiddleware,
];
