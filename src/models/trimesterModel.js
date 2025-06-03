import mongoose from "mongoose";

const trimesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "Trimester number is required"],
    enum: [1, 2, 3],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
});

const Trimester = mongoose.model("Trimester", trimesterSchema);
export default Trimester;
