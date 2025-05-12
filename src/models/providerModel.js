import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be of 100 characters maximum"],
    },
    phone: {
      type: String,
      required: [true, "Phone number must be provided"],
      trim: true,
      unique: true,
    },
    city: {
      type: String,
      required: [true, "City must be providehhd"],
      trim: true,
    },
    governorate: {
      type: String,
      required: [true, "Governorate must be provided"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District must be provided"],
      trim: true,
    },
    workHours: {
      type: String,
      required: [true, "Work hours must be provided"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Provider = mongoose.model("Provider", providerSchema);
export default Provider;
