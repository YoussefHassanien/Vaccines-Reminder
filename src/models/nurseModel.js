import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: [true, "First name must be specified"],
      minlength: [3, "First name is too short"],
      maxlength: [15, "First name is too long"],
    },
    lName: {
      type: String,
      required: [true, "Last name must be specified"],
      minlength: [3, "Last name is too short"],
      maxlength: [15, "Last name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{11}$/, "Phone number must be 11 digits"],
    },
    profileImage: {
      type: String,
      default:
        "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
    },
    hospitalName: {
      type: String,
      required: [true, "Hospital name must be provided"],
      trim: true,
    },
  },
  { timestamps: true }
);
const Nurse = mongoose.model("Nurse", nurseSchema);
export default Nurse;
