import express from "express";
import {
  createCart,
  retreiveUserCartDetails,
  createCartProduct,
} from "./controller.js";
import { createCartValidator } from "./validation.js";
import { createCartLimiter } from "./rateLimiter.js";

const cartsRouter = express.Router();

cartsRouter.post("", createCartLimiter, createCartValidator, createCart);
cartsRouter.post("add-product", createCartProduct);
cartsRouter.get("/user-cart", retreiveUserCartDetails);

export default cartsRouter;
