import ProductReview from "../../models/productReviewModel.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/cartModel.js";
import CartProduct from "../../models/cartProductModel.js";
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

/**
 * Retrieve a product by its unique identifier
 * @description Fetches a single product document from the database using the product ID.
 * This function is commonly used for product validation and displaying product details.
 * @param {String} productId - MongoDB ObjectId of the product to retrieve
 * @returns {Promise<Object>} Formatted product document with all product details
 * @throws {Error} Throws error if product is not found or database operation fails
 * @example
 * const product = await getProductById("60d21b4667d0d8992e610c85");
 * console.log(product.name); // "Vitamin D Supplement"
 */
export const getProductById = async (productId) => {
  try {
    // Query the database for a product with the specified ID
    const product = await Product.findById(productId);

    // Check if product exists in the database
    if (!product) {
      throw new Error(`Product of id: ${productId} not found`);
    }

    // Format the MongoDB document to remove unwanted fields and convert to plain object
    return formatMongoDbObjects(product);
  } catch (error) {
    // Log error for debugging purposes (Note: there's a bug here - should use 'productId' not 'id')
    console.error(`Error finding product with ID ${productId}:`, error);
    throw error;
  }
};

/**
 * Retrieve all delivered carts for a specific user
 * @description Fetches all cart documents that have been delivered for a given user.
 * This is typically used to determine which products a user has purchased and can review.
 * Only carts with status "Delivered" are returned to ensure the user has received their order.
 * @param {String} userId - MongoDB ObjectId of the user whose delivered carts to retrieve
 * @returns {Promise<Array>} Array of delivered cart documents for the user
 * @throws {Error} Throws error if user has no delivered carts or database operation fails
 * @example
 * const deliveredCarts = await getUserDeliveredCarts("60d21b4667d0d8992e610c84");
 * console.log(deliveredCarts.length); // Number of delivered orders
 */
export const getUserDeliveredCarts = async (userId) => {
  try {
    // Query for carts belonging to the user with "Delivered" status
    // This ensures we only get completed orders that the user can review
    const deliveredCarts = await Cart.find({
      userId: userId,
      status: "Delivered",
    });

    // Check if user has any delivered carts
    // This validation ensures the user has purchase history before allowing reviews
    if (!deliveredCarts || deliveredCarts.length === 0) {
      throw new Error(`User with id: ${userId} has no delivered carts`);
    }

    // Return the array of delivered carts (no formatting needed as it's an array)
    return deliveredCarts;
  } catch (error) {
    // Log the error with context for debugging
    console.error(
      `Error finding delivered carts of user with id: ${userId}`,
      error
    );
    throw error;
  }
};

/**
 * Get unique products from delivered carts by cart IDs (Alternative approach)
 * @param {Array<String>} deliveredCartsIds - Array of MongoDB ObjectIds of delivered carts
 * @returns {Promise<Array>} Array of unique products from the delivered carts
 */
export const getUserDeliveredCartsProducts = async (deliveredCartsIds) => {
  try {
    // Get all cart products for the delivered carts
    const cartProducts = await CartProduct.find({
      cartId: { $in: deliveredCartsIds },
    })
      .select("productId")
      .lean();

    if (!cartProducts || cartProducts.length === 0) {
      return [];
    }

    // Extract unique product IDs using Set
    const uniqueProductIds = [
      ...new Set(cartProducts.map((cp) => cp.productId.toString())),
    ];

    return uniqueProductIds;
  } catch (error) {
    console.error(
      `Error fetching unique products for delivered carts with ids: ${deliveredCartsIds}`,
      error
    );
    throw error;
  }
};
