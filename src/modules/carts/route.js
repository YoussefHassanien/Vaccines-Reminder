import express from "express";
import { createCart, retreiveUserCartDetails } from "./controller.js";
import { createCartValidator } from "./validation.js";
import { createCartLimiter } from "./rateLimiter.js";

const cartsRouter = express.Router();

cartsRouter.post("", createCartLimiter, createCartValidator, createCart);
cartsRouter.get("/user-cart", retreiveUserCartDetails);

export default cartsRouter;
