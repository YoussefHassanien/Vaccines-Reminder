import express from "express";
import { createCart } from "./controller.js";
import { createCartValidator } from "./validation.js";
import { createCartLimiter } from "./rateLimiter.js";

const cartsRouter = express.Router();

cartsRouter.post("", createCartLimiter, createCartValidator, createCart);

export default cartsRouter;
