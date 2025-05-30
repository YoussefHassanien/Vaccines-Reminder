import {
  addNewProductReview,
  deleteProductReview,
  hasUserReviewedProduct,
  updateProductRating,
  getProductReviewsCount,
  getProductById,
  getUserDeliveredCarts,
  getUserDeliveredCartsProducts,
} from "./repository.js";

export const insertNewProductReview = async (reviewDetails) => {
  try {
    const newProductReview = await addNewProductReview(reviewDetails);

    return {
      statusCode: 201,
      message: "Product review is successfully created",
      data: newProductReview,
    };
  } catch (error) {
    if (error.message === "You have already reviewed this product") {
      throw {
        statusCode: 400,
        message: "You have already reviewed this product",
      };
    }
    throw {
      statusCode: 500,
      message: "Error inserting product review",
      error: error.message,
    };
  }
};

export const removeProductReview = async (productReviewId) => {
  try {
    const removedProductReview = await deleteProductReview(productReviewId);

    return {
      statusCode: 200,
      message: "Product review is successfully deleted",
      data: { deletedProductReview: removedProductReview },
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error deleting product review",
      error: error.message,
    };
  }
};

export const didUserReviewProduct = async (userId, productId) => {
  try {
    const hasReviewed = await hasUserReviewedProduct(userId, productId);

    return hasReviewed;
  } catch (error) {
    console.error("Error checking user product review status:", error);
    throw {
      statusCode: 500,
      message: "Error checking user product review status",
      error: error.message,
    };
  }
};

export const changeProductRating = async (productId, newRating) => {
  try {
    const updatedProduct = await updateProductRating(productId, newRating);

    return updatedProduct;
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error updating product rating",
      error: error.message,
    };
  }
};

export const fetchProductReviewsCount = async (productId) => {
  try {
    const reviewCount = await getProductReviewsCount(productId);

    return reviewCount;
  } catch (error) {
    console.error("Error fetching product review count:", error);
    throw {
      statusCode: 500,
      message: "Error fetching product review count",
      error: error.message,
    };
  }
};

export const fetchProductById = async (productId) => {
  try {
    const product = await getProductById(productId);

    return product;
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error retrieving product",
      error: error.message,
    };
  }
};

export const fetchUserDeliveredCarts = async (userId) => {
  try {
    const deliveredCarts = await getUserDeliveredCarts(userId);

    return deliveredCarts;
  } catch (error) {
    if (error.message.includes("no delivered carts")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error retrieving user delivered carts",
      error: error.message,
    };
  }
};

export const fetchUserDeliveredCartsProducts = async (deliveredCartsIds) => {
  try {
    const uniqueProductIds = await getUserDeliveredCartsProducts(
      deliveredCartsIds
    );

    return uniqueProductIds;
  } catch (error) {
    console.error("Error retrieving products from delivered carts:", error);
    throw {
      statusCode: 500,
      message: "Error retrieving products from delivered carts",
      error: error.message,
    };
  }
};
