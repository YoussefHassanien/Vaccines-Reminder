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
import { isAuthenticated } from "../../middlewares/authentication.js";

const cartsRouter = express.Router();

cartsRouter.post(
  "",
  createCartLimiter,
  isAuthenticated,
  createCartValidator,
  createCart
);
cartsRouter.get(
  "/user-cart/:cartId",
  retrieveUserCartDetailsLimiter,
  isAuthenticated,
  retrieveUserCartDetailsValidator,
  retreiveUserCartDetails
);

export default cartsRouter;
