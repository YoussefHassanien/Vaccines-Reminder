import ProductReview from "../../models/productReviewModel.js";
import Product from "../../models/productModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

/**
 * Create and save a new product review in the database
 * @param {Object} reviewDetails - Review information (userId, productId, message, rating)
 * @returns {Promise<Object>} Created product review document
 */
export const addNewProductReview = async (reviewDetails) => {
  try {
    const productReview = new ProductReview(reviewDetails);
    const savedReview = await productReview.save();

    // Convert to plain object and remove unwanted fields
    const formattedReview = formatMongoDbObjects(savedReview);

    return formattedReview;
  } catch (error) {
    console.error("Error inserting product review:", error);

    // Handle duplicate review error
    if (error.message === "You have already reviewed this product") {
      throw new Error("You have already reviewed this product");
    }

    throw error;
  }
};

/**
 * Delete a product review from the database
 * @param {String} productReviewId - MongoDB ObjectId of the product review
 * @param {String} userId - User ID to verify ownership
 * @returns {Promise<Object>} Deleted product review document
 */
export const deleteProductReview = async (productReviewId) => {
  try {
    // Find and delete review only if it belongs to the user
    const deletedReview = await ProductReview.findOneAndDelete({
      _id: productReviewId,
    });

    if (!deletedReview) {
      throw new Error(`Product review with id: ${productReviewId} not found`);
    }

    return formatMongoDbObjects(deletedReview);
  } catch (error) {
    console.error(
      `Error deleting product review with id: ${productReviewId}`,
      error
    );
    throw error;
  }
};

/**
 * Check if user has already reviewed a product
 * @param {String} userId - MongoDB ObjectId of the user
 * @param {String} productId - MongoDB ObjectId of the product
 * @returns {Promise<Boolean>} True if user has already reviewed the product
 */
export const hasUserReviewedProduct = async (userId, productId) => {
  try {
    const existingReview = await ProductReview.findOne({ userId, productId });
    return !!existingReview;
  } catch (error) {
    console.error(
      `Error checking if user ${userId} has reviewed product ${productId}`,
      error
    );
    throw error;
  }
};

/**
 * Update product's average rating when a new rating is added
 * @param {String} productId - MongoDB ObjectId of the product
 * @param {Number} newRating - New rating value (1-5)
 * @returns {Promise<Object>} Updated product with new rating
 */
export const updateProductRating = async (productId, newRating) => {
  try {
    // Update the product with new rating
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        rating: newRating,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      throw new Error(`Product with id: ${productId} not found`);
    }

    return formatMongoDbObjects(updatedProduct);
  } catch (error) {
    console.error(
      `Error updating product rating for product id: ${productId}`,
      error
    );
    throw error;
  }
};

/**
 * Get the count of reviews for a specific product
 * @param {String} productId - MongoDB ObjectId of the product
 * @returns {Promise<Number>} Number of reviews for the product
 */
export const getProductReviewsCount = async (productId) => {
  try {
    const reviewCount = await ProductReview.countDocuments({
      productId: productId,
    });

    return reviewCount;
  } catch (error) {
    console.error(
      `Error fetching review count for product id: ${productId}`,
      error
    );
    throw error;
  }
};
