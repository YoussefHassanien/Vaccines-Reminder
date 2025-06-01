import mongoose from "mongoose";
import User from "./userModel.js";

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
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Products count must be an integer",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price of the cart must be provided"],
      min: [0, "Total Price can't be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Online paid", "Waiting for cash payment", "Delivered"],
      default: "Pending",
      required: [true, "Cart status must be specified"],
    },
    governorate: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType !== "Online";
      },
      default: "Cairo",
      minlength: [4, "Address governorate must be at least 4 characters"],
      maxlength: [30, "Address governorate must be of 30 characters maximum"],
    },
    city: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType !== "Online";
      },
      minlength: [4, "Address city must be at least 4 characters"],
      maxlength: [50, "Address city must be of 30 characters maximum"],
    },
    street: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType !== "Online";
      },
      minlength: [4, "Address street must be at least 4 characters"],
      maxlength: [100, "Address street must be of 30 characters maximum"],
    },
    buildingNumber: {
      type: Number,
      required: function () {
        return this.paymentType !== "Online";
      },
      min: [1, "Building number must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Building number must be an integer",
      },
    },
    apartmentNumber: {
      type: Number,
      required: function () {
        return this.paymentType !== "Online";
      },
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

// Insure that the cart address details is the same as user details if the payment type is Online
cartSchema.pre("save", async function () {
  try {
    // Only run this logic when creating a new document or changing payment type
    if (this.isNew || this.isModified("paymentType")) {
      const user = await User.findById(this.userId);
      if (!user) throw new Error("User not found");

      if (this.paymentType === "Online") {
        this.governorate = user.governorate;
        this.city = user.city;
        this.street = user.street;
        this.buildingNumber = user.buildingNumber;
        this.apartmentNumber = user.apartmentNumber;
      }
    }
  } catch (error) {
    // Log the error but don't stop the save operation
    console.error("Error in cart pre-save hook:", error);
    throw error;
  }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
