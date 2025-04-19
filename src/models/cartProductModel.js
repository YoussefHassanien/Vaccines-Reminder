import mongoose from "mongoose";

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

const CartProduct = mongoose.model("Cart", cartProductSchema);
export default CartProduct;
