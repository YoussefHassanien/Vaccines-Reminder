import express from "express";
import {
  createCart,
  retrieveUserPendingCartDetails,
  createCartProduct,
  eraseCartProduct,
  modifyCartProductQuantity,
  eraseCart,
  modifyCartStatus,
  retrieveUserOnlinePaidAndWaitingCarts,
  adminModifyCartStatus,
  modifyCartPaymentType,
} from "./controller.js";
import {
  createCartValidator,
  createCartProductValidator,
  eraseCartProductValidator,
  modifyCartProductQuantityValidator,
  eraseCartValidator,
  modifyCartStatusValidator,
  adminModifyCartStatusValidator,
  modifyCartPaymentTypeValidator,
} from "./validation.js";
import {
  createCartLimiter,
  retrieveUserPendingCartDetailsLimiter,
  createCartProductLimiter,
  eraseCartProductLimiter,
  modifyCartProductQuantityLimiter,
  eraseCartLimiter,
  modifyCartStatusLimiter,
  retrieveUserOnlinePaidAndWaitingCartsLimiter,
  adminModifyCartStatusLimiter,
  modifyCartPaymentTypeLimiter,
} from "./rateLimiter.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const cartsRouter = express.Router();

// Create a new cart
cartsRouter.post(
  "",
  createCartLimiter,
  isAuthenticated,
  createCartValidator,
  createCart
);

// Get user's confirmed and waiting carts
cartsRouter.get(
  "/my-orders",
  retrieveUserOnlinePaidAndWaitingCartsLimiter,
  isAuthenticated,
  retrieveUserOnlinePaidAndWaitingCarts
);

// Get pending cart details
cartsRouter.get(
  "/pending",
  retrieveUserPendingCartDetailsLimiter,
  isAuthenticated,
  retrieveUserPendingCartDetails
);

// Delete the cart
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

cartsRouter.patch(
  "/payment-type/:cartId",
  modifyCartPaymentTypeLimiter,
  isAuthenticated,
  modifyCartPaymentTypeValidator,
  modifyCartPaymentType
);

cartsRouter.patch(
  "/status/admin/:cartId",
  adminModifyCartStatusLimiter,
  isAuthenticated,
  isAuthorized,
  adminModifyCartStatusValidator,
  adminModifyCartStatus
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
