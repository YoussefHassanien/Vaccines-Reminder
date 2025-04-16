import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name must be provided"],
    },
    price: {
      type: Number,
      required: [true, "Product price must be provided"],
    },
    description: {
      type: String,
      required: [true, "Product description must be provided"],
    },
    image: {
      type: String,
      required: [true, "Product image url must be provided"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity must be provided"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
