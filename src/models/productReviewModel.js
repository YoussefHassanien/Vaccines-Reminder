import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
    },
    message: {
      type: String,
      required: [true, "Payment type must be specified"],
      maxlength: [5000, "message must be of 5000 characters maximum"],
      minlength: [10, "message must be at least 10 characters"],
    },
    rating: {
      type: Number,
      min: [0, "Rating can't be negative"],
      max: [5, "Rating can't exceed 5"],
      required: true,
    },
  },
  { timestamps: true }
);

// Create compound unique index for userId and productId
// This ensures one user can only review a product once
productReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Create compound index with _id for better query performance
// This helps with queries that filter by productId and sort by _id (creation order)
productReviewSchema.index({ productId: 1, _id: 1 });

// Custom error message for duplicate review
productReviewSchema.post("save", function (error, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("You have already reviewed this product"));
  } else {
    next(error);
  }
});

const ProductReview = mongoose.model("Product-Review", productReviewSchema);

export default ProductReview;
