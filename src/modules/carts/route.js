import express from "express";
import {
  createCart,
  retrieveUserCartDetails,
  createCartProduct,
  eraseCartProduct,
  modifyCartProductQuantity,
  eraseCart,
  modifyCartStatus,
  retrieveUserPendingCart,
} from "./controller.js";
import {
  createCartValidator,
  retrieveUserCartDetailsValidator,
  createCartProductValidator,
  eraseCartProductValidator,
  modifyCartProductQuantityValidator,
  eraseCartValidator,
  modifyCartStatusValidator,
  retrieveUserPendingCartValidator,
} from "./validation.js";
import {
  createCartLimiter,
  retrieveUserCartDetailsLimiter,
  createCartProductLimiter,
  eraseCartProductLimiter,
  modifyCartProductQuantityLimiter,
  eraseCartLimiter,
  modifyCartStatusLimiter,
  retrieveUserPendingCartLimiter,
} from "./rateLimiter.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

const cartsRouter = express.Router();

// Create a new cart
cartsRouter.post(
  "",
  createCartLimiter,
  isAuthenticated,
  createCartValidator,
  createCart
);

// Get user's pending cart
cartsRouter.get(
  "/pending",
  retrieveUserPendingCartLimiter,
  isAuthenticated,
  retrieveUserPendingCartValidator,
  retrieveUserPendingCart
);

// Get cart details by ID
cartsRouter.get(
  "/:cartId",
  retrieveUserCartDetailsLimiter,
  isAuthenticated,
  retrieveUserCartDetailsValidator,
  retrieveUserCartDetails
);

// Delete entire cart
cartsRouter.delete(
  "/:cartId",
  eraseCartLimiter,
  isAuthenticated,
  eraseCartValidator,
  eraseCart
);

// Update cart status (for cash payments)
cartsRouter.patch(
  "/status/:cartId",
  modifyCartStatusLimiter,
  isAuthenticated,
  modifyCartStatusValidator,
  modifyCartStatus
);

// Add product to cart
cartsRouter.post(
  "/:cartId/products",
  createCartProductLimiter,
  isAuthenticated,
  createCartProductValidator,
  createCartProduct
);

// Remove product from cart
cartsRouter.delete(
  "/:cartId/products/:productId",
  eraseCartProductLimiter,
  isAuthenticated,
  eraseCartProductValidator,
  eraseCartProduct
);

// Update product quantity in cart
cartsRouter.patch(
  "/:cartId/products/:productId",
  modifyCartProductQuantityLimiter,
  isAuthenticated,
  modifyCartProductQuantityValidator,
  modifyCartProductQuantity
);

export default cartsRouter;
