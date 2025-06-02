import mongoose from "mongoose";

const nurseSlotSchema = new mongoose.Schema({
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse",
    required: [true, "Nurse ID must be provided"],
  },
  date: {
    type: Date,
    required: [true, "Date must be specified"],
  },
  startTime: {
    type: String,
    required: [true, "Start time must be specified"],
  },
  endTime: {
    type: String,
    required: [true, "End time must be specified"],
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const NurseSlot = mongoose.model("NurseSlot", nurseSlotSchema);
export default NurseSlot;
