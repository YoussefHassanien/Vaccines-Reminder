import { Router } from "express";
import { createNewProductReview, eraseProductReview } from "./controller.js";
import {
  createProductReviewValidator,
  eraseProductReviewValidator,
} from "./validation.js";
import {
  createProductReviewLimiter,
  eraseProductReviewLimiter,
} from "./rateLimiter.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const productsReviewsRouter = Router();

// Create a new product review
productsReviewsRouter.post(
  "/:productId",
  createProductReviewLimiter,
  isAuthenticated,
  createProductReviewValidator,
  createNewProductReview
);

productsReviewsRouter.delete(
  "/:reviewId",
  eraseProductReviewLimiter,
  isAuthenticated,
  isAuthorized,
  eraseProductReviewValidator,
  eraseProductReview
);

export default productsReviewsRouter;
