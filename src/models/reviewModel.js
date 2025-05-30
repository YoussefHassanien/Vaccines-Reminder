import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Cart id is required"],
      index: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
      index: true,
    },
    message: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Product rating must be provided"],
      min: [0, "Rating must be at least equal 0"],
      max: [5, "Rating can be at most equal 5"],
    },
  },
  {
    timestamps: true,
  }
);

// Add compound unique index for userId + productId
productReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const ProductReview = mongoose.model("Product-Review", productReviewSchema);
export default ProductReview;
