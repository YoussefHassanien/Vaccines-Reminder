import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
      index: true,
    },
    city: {
      type: String,
      trim: true,
      required: [true, "City must be provided"],
    },
    state: {
      type: String,
      trim: true,
      required: [true, "State must be provided"],
    },
  },
  { timestamps: true }
);

const Parent = mongoose.model("Parent", parentSchema);
export default Parent;
