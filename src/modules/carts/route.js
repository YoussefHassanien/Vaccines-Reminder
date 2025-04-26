import express from "express";
import {
  createCart,
  retrieveUserCartDetails,
  createCartProduct,
  eraseCartProduct,
  modifyCartProductQuantity,
  eraseCart,
} from "./controller.js";
import {
  createCartValidator,
  retrieveUserCartDetailsValidator,
  createCartProductValidator,
  eraseCartProductValidator,
  modifyCartProductQuantityValidator,
  eraseCartValidator,
} from "./validation.js";
import {
  createCartLimiter,
  retrieveUserCartDetailsLimiter,
  createCartProductLimiter,
  eraseCartProductLimiter,
  modifyCartProductQuantityLimiter,
  eraseCartLimiter,
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

// Get cart details by ID
cartsRouter.get(
  "/:cartId",
  retrieveUserCartDetailsLimiter,
  isAuthenticated,
  retrieveUserCartDetailsValidator,
  retrieveUserCartDetails
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

// Delete entire cart
cartsRouter.delete(
  "/:cartId",
  eraseCartLimiter,
  isAuthenticated,
  eraseCartValidator,
  eraseCart
);

export default cartsRouter;
