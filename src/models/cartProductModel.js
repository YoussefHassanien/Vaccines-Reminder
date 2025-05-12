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

// Add pre-save middleware to auto-update price when quantity changes
cartProductSchema.pre("save", async function (next) {
  try {
    // Only proceed if quantity was modified
    if (this.isModified("quantity")) {
      // Fetch the product to get its price
      const product = await Product.findById(this.productId);

      if (!product) {
        return next(new Error(`Product with ID ${this.productId} not found`));
      }

      // Calculate and set the new price automatically
      const newPrice = product.price * this.quantity;

      // Set the new price (this will mark price as modified)
      this.price = newPrice;

      console.log(
        `Auto-updated price to ${newPrice} for cart product with product ID ${this.productId}`
      );
    }

    next();
  } catch (error) {
    console.error("Error in cart product pre-save middleware:", error);
    next(error);
  }
});

const CartProduct = mongoose.model("Cart-Product", cartProductSchema);
export default CartProduct;
