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
      required: [true, "Price must be provided"],
      min: [1, "Price must be a postive number"],
    },
    description: {
      type: [String],
      required: [true, "Description must be provided"],
      validate: [
        {
          // Validate minimum array length
          validator: function (val) {
            return val.length >= 1;
          },
          message: "Product must have at least one description bullet point",
        },
        {
          // Validate maximum array length
          validator: function (val) {
            return val.length <= 10;
          },
          message: "Product can have maximum 10 description bullet points",
        },
        {
          // Validate each string in the array
          validator: function (val) {
            return val.every(
              (feature) => feature.length >= 3 && feature.length <= 500
            );
          },
          message:
            "Each description bullet point must be between 3 and 500 characters",
        },
      ],
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
          message: "Each feature must be between 3 and 500 characters",
        },
      ],
    },
    requiredAge: {
      type: String,
      trim: true,
      required: [true, "Required age information must be provided"],
      minlength: [5, "Required age must be at least 5 characters"],
      maxlength: [100, "Required age must be of 30 characters maximum"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to populate reviews with user details
productSchema.virtual("reviews", {
  ref: "Product-Review", // Reference to ProductReview model
  localField: "_id", // Product's _id field
  foreignField: "productId", // ProductReview's productId field
  options: {
    sort: { createdAt: -1 }, // Sort by newest first
    populate: {
      path: "userId",
      select: "fName lName email", // Only get first name, last name, and email
      model: "User",
    },
  },
});

// Trim each feature string
productSchema.pre("save", function (next) {
  if (this.features && Array.isArray(this.features)) {
    this.features = this.features.map((feature) =>
      typeof feature === "string" ? feature.trim() : feature
    );
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
