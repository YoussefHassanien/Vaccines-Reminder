import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    birthDate: {
      type: Date,
      required: [true, "Birth date is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "gender is required"],
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood type is required"],
    },
    ssn: {
      type: String,
      required: [true, "SSN is required"],
      unique: true,
      length: 14,
      match: /^\d+$/,
    },
    birthCertificate: {
      type: String,
      required: [true, "Birth certificate is required"],
    },
  },
  { timestamps: true }
);

const Child = mongoose.model("Child", childSchema);
export default Child;
