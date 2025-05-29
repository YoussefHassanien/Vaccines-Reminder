import { addNewProductReview, deleteProductReview } from "./repository.js";

export const insertNewProductReview = async (reviewDetails) => {
  try {
    const newProductReview = await addNewProductReview(reviewDetails);

    return {
      status: 201,
      message: "Product review is successfully created",
      data: newProductReview,
    };
  } catch (error) {
    if (error.message === "You have already reviewed this product") {
      return {
        statusCode: 400,
        message: "You have already reviewed this product",
      };
    }
    return {
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
      return {
        statusCode: 400,
        message: error.message,
      };
    }
    return {
      statusCode: 500,
      message: "Error deleting product review",
      error: error.message,
    };
  }
};
