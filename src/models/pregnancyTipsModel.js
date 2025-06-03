import mongoose from "mongoose";

const pregnancyTipsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
});

const PregnancyTips = mongoose.model("PregnancyTips", pregnancyTipsSchema);
export default PregnancyTips;
