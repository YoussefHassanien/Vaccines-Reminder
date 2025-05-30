import { body, param } from "express-validator";
import {
  fetchProductById,
  didUserReviewProduct,
  fetchUserDeliveredCarts,
  fetchUserDeliveredCartsProducts,
} from "./services.js";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Create product review validation
export const createProductReviewValidator = [
  // Validate productId parameter
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID format")
    .custom(async (productId, { req }) => {
      try {
        // Check if product exists
        const product = await fetchProductById(productId);

        // Attach product to the request
        req.product = product;

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),

  // Check if user has delivered carts with this product
  body().custom(async (_, { req }) => {
    try {
      const productId = req.params.productId;

      // Get user's delivered carts
      const deliveredCarts = await fetchUserDeliveredCarts(req.user._id);

      // Extract cart IDs from delivered carts
      const cartIds = deliveredCarts.map((cart) => cart._id);

      // Get unique product IDs from delivered carts
      const deliveredProducts = await fetchUserDeliveredCartsProducts(cartIds);

      // Check if the requested product ID exists in delivered products
      const productFound = deliveredProducts.some(
        (deliveredProductId) =>
          deliveredProductId.toString() === productId.toString()
      );

      if (!productFound) {
        throw new Error(
          "You can't review a product that has not been delivered to you yet"
        );
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  // Check if user already reviewed this product
  body().custom(async (_, { req }) => {
    try {
      const productId = req.params.productId;
      const userId = req.user._id;

      const hasReviewed = await didUserReviewProduct(userId, productId);

      if (hasReviewed) {
        throw new Error("You have already reviewed this product");
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  // Validate request body
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Review message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Review message must be between 10 and 5000 characters")
    .escape(), // Sanitize HTML entities

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5")
    .toInt(),

  // Handle validation errors
  validatorMiddleware,
];
