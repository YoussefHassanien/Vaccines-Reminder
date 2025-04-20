import mongoose from "mongoose";
import Product from "./productModel.js";

const cartProductSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
      required: [true, "Cart id is required"],
      index: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity must be provided"],
      min: [1, "Product quantity at least can be 1"],
      validate: {
        validator: Number.isInteger,
        message: "Products count must be an integer",
      },
    },
    price: {
      type: Number,
      required: [true, "Total price of the product quantity must be provided"],
      min: [1, "Price must be a postive number"],
    },
  },
  {
    timestamps: true,
  }
);

// Add compound unique index for cartId + productId
cartProductSchema.index({ cartId: 1, productId: 1 }, { unique: true });

// Add pre-save middleware to validate price calculation
cartProductSchema.pre("save", async function (next) {
  try {
    if (
      this.isModified("productId") ||
      this.isModified("quantity") ||
      this.isModified("price")
    ) {
      // Fetch the product to get its price
      const product = await Product.findById(this.productId);

      if (!product) {
        return next(new Error(`Product with ID ${this.productId} not found`));
      }

      // Calculate the expected price
      const expectedPrice = product.price * this.quantity;

      // Compare with a small tolerance for floating point errors
      if (Math.abs(this.price - expectedPrice) > 0.01) {
        return next(
          new Error(
            `Price validation failed: expected ${expectedPrice} (${product.price} × ${this.quantity}), but got ${this.price}`
          )
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const CartProduct = mongoose.model("Cart-Product", cartProductSchema);
export default CartProduct;
