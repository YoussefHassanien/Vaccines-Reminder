import {
  insertNewProductReview,
  removeProductReview,
  fetchProductReviewsCount,
  fetchProductById,
  changeProductRating,
} from "./services.js";
import { calculateAverage } from "../../utils/calculateAverage.js";

export const createNewProductReview = async (req, res) => {
  const { message, rating } = req.body;
  const user = req.user;
  const product = req.product;

  try {
    // Get the CURRENT review count BEFORE adding the new review
    const reviewsCount = await fetchProductReviewsCount(product._id);

    const {
      statusCode,
      message: ResponseMessage,
      data,
    } = await insertNewProductReview({
      message,
      rating,
      userId: user._id,
      productId: product._id,
    });

    // Calculate new average using the count BEFORE adding this review
    const productAverageRating = calculateAverage(
      product.rating, // Current average
      reviewsCount, // Count BEFORE this review
      rating // The new rating being added
    );

    await changeProductRating(product._id, productAverageRating);

    return res.status(statusCode).json({
      message: ResponseMessage,
      data,
    });
  } catch (error) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, error: error.error });
  }
};

export const eraseProductReview = async (req, res) => {
  const productReview = req.review;

  try {
    // Get the product information
    const product = await fetchProductById(productReview.productId);

    // Get the CURRENT review count BEFORE deleting the review
    const reviewsCount = await fetchProductReviewsCount(product._id);

    const {
      statusCode,
      message: ResponseMessage,
      data,
    } = await removeProductReview(productReview._id);

    // Calculate new average using the count BEFORE deleting this review
    // Pass negative rating value to indicate removal
    const productAverageRating = calculateAverage(
      product.rating, // Current average
      reviewsCount, // Count BEFORE this review deletion
      -productReview.rating // The rating being removed (negative value)
    );

    await changeProductRating(product._id, productAverageRating);

    return res.status(statusCode).json({
      message: ResponseMessage,
      data,
    });
  } catch (error) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, error: error.error });
  }
};
