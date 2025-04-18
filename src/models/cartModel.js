import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Parent",
      required: [true, "User id is required"],
      index: true,
    },
    productsCount: {
      type: Number,
      required: [true, "Cart must have at least one product"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price of the cart must be given"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "waiting for cash payment"],
      default: "pending",
      required: [true, "Cart status is required"],
    },
    city: {
      type: String,
      required: [true, "Address city is required"],
    },
    state: {
      type: String,
      required: [true, "Address state is required"],
    },
    paymentType: {
      type: String,
      enum: ["cash", "online"],
      default: "online",
      required: [true, "Payment type must be specified"],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
