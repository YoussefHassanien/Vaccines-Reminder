import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    message: {
      type: String,
      required: [true, "Payment type must be specified"],
      maxlength: [5000, "message must be of 5000 characters maximum"],
    },
    type: {
      type: String,
      enum: ["Complaint", "Suggestion", "Question"],
      required: true,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
