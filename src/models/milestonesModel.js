import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: [true, "Week number is required"],
    unique: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
});

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
