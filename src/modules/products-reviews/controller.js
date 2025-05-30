import {
  insertNewProductReview,
  removeProductReview,
  fetchProductReviewsCount,
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
