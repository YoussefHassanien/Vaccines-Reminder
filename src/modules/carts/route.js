import express from "express";
import {
  createCart,
  retreiveUserCartDetails,
  // createCartProduct,
} from "./controller.js";
import {
  createCartValidator,
  retrieveUserCartDetailsValidator,
} from "./validation.js";
import {
  createCartLimiter,
  retrieveUserCartDetailsLimiter,
} from "./rateLimiter.js";

const cartsRouter = express.Router();

cartsRouter.post("", createCartLimiter, createCartValidator, createCart);
// cartsRouter.post("/add-product", createCartProduct);
cartsRouter.get(
  "/user-cart/:cartId",
  retrieveUserCartDetailsLimiter,
  retrieveUserCartDetailsValidator,
  retreiveUserCartDetails
);

export default cartsRouter;
