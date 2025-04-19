import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
      index: true,
    },
    productsCount: {
      type: Number,
      required: [true, "Cart products count must be provided"],
      min: [1, "Cart must have at least one product"],
      validate: {
        validator: Number.isInteger,
        message: "Products count must be an integer",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price of the cart must be provided"],
      min: [1, "Price must be a postive number"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Waiting for cash payment"],
      default: "Pending",
      required: [true, "Cart status must be specified"],
    },
    governorate: {
      type: String,
      trim: true,
      required: [true, "Address governorate must be provided"],
      default: "Cairo",
      minlength: [4, "Address governorate must be at least 4 characters"],
      maxlength: [30, "Address governorate must be of 30 characters maximum"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "Address city must be provided"],
      minlength: [4, "Address city must be at least 4 characters"],
      maxlength: [50, "Address city must be of 30 characters maximum"],
    },
    street: {
      type: String,
      trim: true,
      required: [true, "Address street must be provided"],
      minlength: [4, "Address street must be at least 4 characters"],
      maxlength: [100, "Address street must be of 30 characters maximum"],
    },
    buildingNumber: {
      type: Number,
      required: [true, "Address building number must be provided"],
      min: [1, "Building number must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Building number must be an integer",
      },
    },
    appartmentNumber: {
      type: Number,
      required: [true, "Address appartment number must be provided"],
      min: [1, "Appartment number must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Appartment number must be an integer",
      },
    },
    paymentType: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Online",
      required: [true, "Payment type must be specified"],
    },
  },
  {
    timestamps: true,
  }
);

// Add compound unique index for cartId + productId
cartSchema.index({ userId: 1, _id: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
