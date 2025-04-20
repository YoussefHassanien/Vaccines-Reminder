import express from "express";
import { createCart, retreiveUserCartDetails } from "./controller.js";
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
cartsRouter.get(
  "/user-cart/:cartId",
  retrieveUserCartDetailsLimiter,
  retrieveUserCartDetailsValidator,
  retreiveUserCartDetails
);

export default cartsRouter;
