import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name must be provided"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be of 100 characters maximum"],
    },
    price: {
      type: Number,
      default: 1,
      required: [true, "Price must be provided"],
      min: [1, "Price must be a postive number"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description must be provided"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlenght: [1000, "Description must be of 1000 characters maximum"],
    },
    image: {
      type: String,
      trim: true,
      required: [true, "Image url must be provided"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity must be provided"],
      min: [0, "Quantity can't be negative"],
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    rating: {
      type: Number,
      default: 0,
      required: [true, "Rating must be provided"],
      min: [0, "Rating can't be negative"],
      max: [5, "Rating can't exceed 5"],
    },
    features: {
      type: [String],
      required: [true, "Features must be provided"],
      validate: [
        {
          // Validate minimum array length
          validator: function (val) {
            return val.length >= 1;
          },
          message: "Product must have at least one feature",
        },
        {
          // Validate maximum array length
          validator: function (val) {
            return val.length <= 10;
          },
          message: "Product can have maximum 10 features",
        },
        {
          // Validate each string in the array
          validator: function (val) {
            return val.every(
              (feature) => feature.length >= 3 && feature.length <= 500
            );
          },
          message: "Each feature must be between 3 and 250 characters",
        },
      ],
    },
    requiredAge: {
      type: String,
      required: [true, "Required age information must be provided"],
      minlength: [5, "Required age must be at least 5 characters"],
      maxlength: [30, "Required age must be of 30 characters maximum"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
