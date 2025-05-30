import { Router } from "express";
import { createNewProductReview } from "./controller.js";
import { createProductReviewValidator } from "./validation.js";
import { createProductReviewLimiter } from "./rateLimiter.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

const productsReviewsRouter = Router();

// Create a new product review
productsReviewsRouter.post(
  "/:productId",
  createProductReviewLimiter,
  isAuthenticated,
  createProductReviewValidator,
  createNewProductReview
);

export default productsReviewsRouter;
