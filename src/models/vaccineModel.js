import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be of 100 characters maximum"],
    },
    slug: {
      type: String,
      required: [true, "Slug must be provided"],
      unique: true,
      trim: true,
    },
    requiredAge: {
      type: Number,
      required: [true, "Required age must be provided"],
      min: [0, "Required age can't be negative"],
    },
    description: {
      type: String,
      required: [true, "Description must be provided"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description must be of 1000 characters maximum"],
    },
    price: {
      type: Number,
      required: [true, "Price must be provided"],
      min: [0, "Price can't be negative"],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "Provider must be provided"],
    },
  },
  { timestamps: true }
);

const Vaccine = mongoose.model("Vaccine", vaccineSchema);
export default Vaccine;
