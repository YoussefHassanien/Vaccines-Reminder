import { body, query, validationResult, param } from "express-validator";

/**
 * Product validation middleware
 *
 * Validates and sanitizes product data:
 * - name: required, string, min length 2, max length 100, escaped for XSS protection
 * - description: required, string, min length 10, max length 1000, escaped for XSS protection
 * - price: required, positive number
 * - quantity: required, positive integer
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
    .withMessage("Description must be between 10 and 1000 characters")
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
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  // Process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.mapped(),
        message: "Validation failed. Please check your input.",
      });
    }
    next();
  },
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

  // Process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.mapped(),
        message: "Validation failed. Please check your input.",
      });
    }
    next();
  },
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

  // Process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.mapped(),
        message: "Validation failed. Please check your input.",
      });
    }
    next();
  },
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

  // Process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.mapped(),
        message: "Validation failed. Please check your input.",
      });
    }
    next();
  },
];
