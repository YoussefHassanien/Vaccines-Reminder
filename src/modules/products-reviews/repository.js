import ProductReview from "../../models/productReviewModel.js";
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
export const deleteProductReview = async (productReviewId, userId) => {
  try {
    // Find and delete review only if it belongs to the user
    const deletedReview = await ProductReview.findOneAndDelete({
      _id: productReviewId,
      userId: userId,
    });

    if (!deletedReview) {
      throw new Error(
        `Product review with id: ${productReviewId} not found or does not belong to user`
      );
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
 * Get average rating for a specific product
 * @param {String} productId - MongoDB ObjectId of the product
 * @returns {Promise<Object>} Average rating for the product
 */
export const getSpecificProductAverageRating = async (productId) => {
  try {
    const ratingStats = await ProductReview.aggregate([
      {
        $match: { productId: productId },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          ratings: { $push: "$rating" },
        },
      },
      {
        $addFields: {
          // Round average rating to 1 decimal place
          averageRating: { $round: ["$averageRating", 1] },
        },
      },
      {
        $project: {
          productId: "$_id",
          averageRating: 1,
          _id: 0,
        },
      },
    ]);

    // Return default values if no reviews found
    if (!ratingStats || ratingStats.length === 0) {
      return {
        productId: productId,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        },
      };
    }

    return ratingStats[0];
  } catch (error) {
    console.error(
      `Error fetching average rating for product id: ${productId}`,
      error
    );
    throw error;
  }
};

/**
 * Get all product reviews from the database grouped by product ID (Alternative approach)
 * @returns {Promise<Array>} Array of products with their reviews and user details
 */
export const getAllProductsReviews = async () => {
  try {
    const reviews = await ProductReview.find()
      .populate({
        path: "userId",
        select: "fName lName email",
      })
      .populate({
        path: "productId",
        select: "name image price",
      })
      .lean();

    // Transform and group by product ID
    const groupedByProduct = {};

    reviews.forEach((review) => {
      const { userId, productId, ...rest } = review;
      const productIdStr = productId._id.toString();

      if (!groupedByProduct[productIdStr]) {
        groupedByProduct[productIdStr] = {
          product: {
            _id: productId._id,
            name: productId.name,
            image: productId.image,
            price: productId.price,
          },
          reviews: [],
          totalReviews: 0,
          averageRating: 0,
        };
      }

      groupedByProduct[productIdStr].reviews.push({
        _id: rest._id,
        message: rest.message,
        rating: rest.rating,
        user: userId,
        createdAt: rest.createdAt,
        updatedAt: rest.updatedAt,
      });

      groupedByProduct[productIdStr].totalReviews++;
    });

    // Calculate average ratings
    Object.values(groupedByProduct).forEach((productGroup) => {
      const totalRating = productGroup.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      productGroup.averageRating =
        Math.round((totalRating / productGroup.totalReviews) * 10) / 10;
    });

    // Convert to array and sort by product name
    const result = Object.values(groupedByProduct).sort((a, b) =>
      a.product.name.localeCompare(b.product.name)
    );

    return formatMongoDbObjects(result);
  } catch (error) {
    console.error(
      "Error fetching all product reviews grouped by product",
      error
    );
    throw error;
  }
};

/**
 * Get reviews for a specific product
 * @param {String} productId - MongoDB ObjectId of the product
 * @returns {Promise<Object>} Product reviews with metadata
 */
export const getProductReviews = async (productId) => {
  try {
    const reviews = await ProductReview.find({ productId: productId })
      .populate({
        path: "userId",
        select: "fName lName email",
      })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    if (!reviews || reviews.length === 0) {
      return {
        product: null,
        reviews: [],
        totalReviews: 0,
        averageRating: 0,
      };
    }

    // Get product details from a separate query to avoid duplication
    const productDetails = await ProductReview.findOne({ productId })
      .populate({
        path: "productId",
        select: "name image price",
      })
      .select("productId")
      .lean();

    // Transform the data to rename populated fields
    const transformedReviews = reviews.map((review) => {
      const { userId, productId, ...rest } = review;
      return {
        ...rest,
        user: userId,
      };
    });

    // Calculate average rating
    const totalRating = transformedReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      Math.round((totalRating / transformedReviews.length) * 10) / 10;

    // Return proper object structure
    const result = {
      product: productDetails?.productId
        ? {
            _id: productDetails.productId._id,
            name: productDetails.productId.name,
            image: productDetails.productId.image,
            price: productDetails.productId.price,
          }
        : null,
      reviews: transformedReviews,
      totalReviews: transformedReviews.length,
      averageRating: averageRating,
    };

    return formatMongoDbObjects(result);
  } catch (error) {
    console.error(`Error fetching reviews for product id: ${productId}`, error);
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
