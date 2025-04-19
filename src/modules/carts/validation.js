import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

/**
 * Validation middleware for cart creation
 *
 * Validates all required cart fields according to the cart model schema:
 * - userId: Valid MongoDB ObjectId, required
 * - productsCount: Positive integer, required
 * - totalPrice: Positive number, required
 * - status: Optional, enum ["Pending", "Confirmed", "Waiting for cash payment"]
 * - governorate: String, 4-30 chars, required
 * - city: String, 4-50 chars, required
 * - street: String, 4-100 chars, required
 * - buildingNumber: Positive integer, required
 * - appartmentNumber: Positive integer, required
 * - paymentType: Optional, enum ["cash", "online"]
 */
export const createCartValidator = [
  // Products count validation
  body("productsCount")
    .notEmpty()
    .withMessage("Products count is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Products count must be a positive integer"),

  // Total price validation
  body("totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .bail()
    .isFloat({ min: 1 })
    .withMessage("Total price must be a positive number"),

  // Status validation (optional, has default)
  body("status")
    .optional()
    .escape()
    .isIn(["Pending", "Confirmed", "Waiting for cash payment"])
    .withMessage(
      "Status value must be 'Pending', 'Confirmed' or 'Waiting for cash payment'"
    ),

  // Governorate validation
  body("governorate")
    .notEmpty()
    .withMessage("Governorate is required")
    .bail()
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Governorate must be between 4 and 30 characters")
    .bail()
    .escape(),

  // City validation
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .bail()
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage("City must be between 4 and 50 characters")
    .bail()
    .escape(),

  // Street validation
  body("street")
    .notEmpty()
    .withMessage("Street is required")
    .bail()
    .trim()
    .isLength({ min: 4, max: 100 })
    .withMessage("Street must be between 4 and 100 characters")
    .bail()
    .escape(),

  // Building number validation
  body("buildingNumber")
    .notEmpty()
    .withMessage("Building number is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer"),

  // Apartment number validation
  body("appartmentNumber")
    .notEmpty()
    .withMessage("Apartment number is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Apartment number must be a positive integer"),

  // Payment type validation (optional, has default)
  body("paymentType")
    .optional()
    .escape()
    .isIn(["Cash", "Online"])
    .withMessage("Payment type must be either 'Cash' or 'Online'"),

  // Process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.mapped(),
      });
    }
    next();
  },
];
