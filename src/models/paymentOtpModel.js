import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
      required: [true, "Cart id is required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Product id is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Code must be provided"],
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid otp code! Must be exactly 6 digits.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CartProduct = mongoose.model("Cart", cartProductSchema);
export default CartProduct;
