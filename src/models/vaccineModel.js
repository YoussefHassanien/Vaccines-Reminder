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
    requiredAge: {
      type: String,
      required: [true, "Required age must be provided"],
      enum: {
        values: [
          "No specific age required",
          "24 hours",
          "6 weeks",
          "10 weeks",
          "14 weeks",
          "3 months",
          "6 months",
          "9 months",
          "1 year",
          "1 year and 3 months",
          "1 year and 6 months",
          "1 year and 9 months",
          "2 years",
          "2 years and 3 months",
          "2 years and 6 months",
          "2 years and 9 months",
          "3 years",
          "3 years and 3 months",
          "3 years and 6 months",
          "3 years and 9 months",
          "4 years",
        ],
        message:
          "'{VALUE}' is not a valid age requirement. Please choose from the predefined age options.",
      },
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
