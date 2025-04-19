import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

/**
 * Validation middleware for cart creation
 *
 * Validates all required cart fields according to the cart model schema:
 * - productsCount: Positive integer, required matching the sum of quantaties given in the cartProductsData Array
 * - totalPrice: Positive number, required and matching the sum of prices given in the cartProductsData Array
 * - governorate: String, 4-30 chars, required
 * - city: String, 4-50 chars, required
 * - street: String, 4-100 chars, required
 * - buildingNumber: Positive integer, required
 * - appartmentNumber: Positive integer, required
 * - paymentType: Optional, enum ["cash", "online"]
 */
export const createCartValidator = [
  // Products array validation
  body("products")
    .isArray({ min: 1 })
    .withMessage("Cart must contain at least one product"),

  // Validate each product in the array
  body("products.*.productId")
    .notEmpty()
    .withMessage("Product ID is required for each product")
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format"),

  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("products.*.price")
    .isFloat({ min: 0.01 })
    .withMessage("Product price must be a positive number"),

  // Totals validation - custom validator to ensure consistency
  body().custom((body) => {
    // Skip validation if products array is missing or invalid
    if (!Array.isArray(body.products)) return true;

    // Calculate expected totals from products
    const calculatedTotalPrice = body.products.reduce(
      (sum, product) => sum + Number(product.price),
      0
    );

    const calculatedProductsCount = body.products.reduce(
      (sum, product) => sum + Number(product.quantity),
      0
    );

    // Compare with provided values (with small tolerance for floating point)
    const priceMatches =
      Math.abs(calculatedTotalPrice - parseFloat(body.cart.totalPrice)) < 0.01;
    const countMatches =
      calculatedProductsCount === parseInt(body.cart.productsCount, 10);

    if (!priceMatches || !countMatches) {
      throw new Error(
        `Cart totals don't match products data. Expected: ${calculatedTotalPrice} and ${calculatedProductsCount} but got ${body.cart.totalPrice} and ${body.cart.productsCount}`
      );
    }

    return true;
  }),

  // Cart object validation
  body("cart").isObject().withMessage("Cart details must be provided"),

  // Products count validation
  body("cart.productsCount")
    .notEmpty()
    .withMessage("Products count is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Products count must be a positive integer"),

  // Total price validation
  body("cart.totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .bail()
    .isFloat({ min: 1 })
    .withMessage("Total price must be a positive number"),

  // Governorate validation
  body("cart.governorate")
    .notEmpty()
    .withMessage("Governorate is required")
    .bail()
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Governorate must be between 4 and 30 characters")
    .bail()
    .escape(),

  // City validation
  body("cart.city")
    .notEmpty()
    .withMessage("City is required")
    .bail()
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage("City must be between 4 and 50 characters")
    .bail()
    .escape(),

  // Street validation
  body("cart.street")
    .notEmpty()
    .withMessage("Street is required")
    .bail()
    .trim()
    .isLength({ min: 4, max: 100 })
    .withMessage("Street must be between 4 and 100 characters")
    .bail()
    .escape(),

  // Building number validation
  body("cart.buildingNumber")
    .notEmpty()
    .withMessage("Building number is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer"),

  // Apartment number validation
  body("cart.appartmentNumber")
    .notEmpty()
    .withMessage("Apartment number is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Apartment number must be a positive integer"),

  // Payment type validation (optional, has default)
  body("cart.paymentType")
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
