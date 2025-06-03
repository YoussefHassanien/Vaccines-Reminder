import mongoose from "mongoose";

const recommendedFoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Food name is required"],
    minlenghth: [3, "Food name must be at least 3 characters long"],
    maxlength: [20, "Food name must be at most 20 characters long"],
  },
  imgUrl: {
    type: String,
    required: [true, "Image URL is required"],
  },
});
const RecommendedFood = mongoose.model(
  "RecommendedFood",
  recommendedFoodSchema
);
export default RecommendedFood;
