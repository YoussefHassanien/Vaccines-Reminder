import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import mongoose from "mongoose";
import { fetchProductById } from "./services.js";

// New helper function for address field validation
const validateAddressField = (fieldName, errorMessage) => {
  return (value, { req }) => {
    // Skip validation if payment type is Online
    if (req.body.cart.paymentType === "Online") return true;

    // Otherwise require the field for Cash payments
    if (value === undefined || value === null || value === "") {
      throw new Error(
        `${errorMessage || fieldName} is required for Cash payment`
      );
    }
    return true;
  };
};

/**
 * Validation middleware for cart creation
 *
 * Validates all required cart fields according to the cart model schema:
 * - productsCount: Positive integer, required matching the sum of quantaties given in the cartProductsData Array
 * - totalPrice: Positive number, required and matching the sum of prices given in the cartProductsData Array
 * - governorate: String, 4-30 chars, required for Cash payments only
 * - city: String, 4-50 chars, required for Cash payments only
 * - street: String, 4-100 chars, required for Cash payments only
 * - buildingNumber: Positive integer, required for Cash payments only
 * - appartmentNumber: Positive integer, required for Cash payments only
 * - paymentType: Optional, enum ["Cash", "Online"]
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

  // Validate product IDs are unique
  body("products")
    .custom((products) => {
      // Create a set of product IDs to check for duplicates
      const productIds = new Set();

      // Check each product ID
      for (const product of products) {
        if (productIds.has(product.productId)) {
          return false; // Duplicate found
        }
        productIds.add(product.productId);
      }

      return true; // All product IDs are unique
    })
    .withMessage(
      "Each product in the cart must be unique. Duplicate product IDs found."
    ),

  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("products.*.price")
    .isFloat({ min: 0.01 })
    .withMessage("Product price must be a positive number"),

  // Product price validation against database - add this custom validator
  body("products").custom(async (products, { req }) => {
    // Check each product's price against database
    for (const product of products) {
      const productResponse = await fetchProductById(product.productId);

      // If product not found, throw error
      if (productResponse.statusCode !== 200) {
        throw new Error(`Product not found: ${productResponse.message}`);
      }

      const databaseProduct = productResponse.data;
      const expectedPrice = Number(databaseProduct.price * product.quantity);

      // Compare with the provided price (with small tolerance for floating point)
      if (Math.abs(Number(product.price) - expectedPrice) > 0.01) {
        throw new Error(
          `Product ${product.productId} price incorrect: expected ${expectedPrice} but got ${product.price}`
        );
      }
    }

    return true;
  }),

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

  // Payment type validation (must be validated early since other validations depend on it)
  body("cart.paymentType")
    .optional()
    .escape()
    .isIn(["Cash", "Online"])
    .withMessage("Payment type must be either 'Cash' or 'Online'"),

  // Conditional address validations based on payment type
  body("cart.governorate")
    .custom(validateAddressField("Governorate"))
    .bail()
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Governorate must be between 4 and 30 characters")
    .bail()
    .escape(),

  body("cart.city")
    .custom(validateAddressField("City"))
    .bail()
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage("City must be between 4 and 50 characters")
    .bail()
    .escape(),

  body("cart.street")
    .custom(validateAddressField("Street"))
    .bail()
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 4, max: 100 })
    .withMessage("Street must be between 4 and 100 characters")
    .bail()
    .escape(),
  
  body("cart.buildingNumber")
    .custom(validateAddressField("Building number"))
    .bail()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer"),

  body("cart.apartmentNumber")
    .custom(validateAddressField("Apartment number"))
    .bail()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Apartment number must be a positive integer"),

  validatorMiddleware,
];

/**
 * Validation middleware for retrieving user cart details
 *
 * Validates that the cartId parameter is a valid MongoDB ObjectId
 */
export const retrieveUserCartDetailsValidator = [
  // Validate cartId parameter
  param("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid cart ID format. Must be a valid MongoDB ObjectId"),

  validatorMiddleware,
];
