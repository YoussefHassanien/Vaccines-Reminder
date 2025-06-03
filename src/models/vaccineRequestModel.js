import mongoose from "mongoose";

const vaccineRequestSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
      index: true,
    },
    childId: {
      type: mongoose.Schema.ObjectId,
      ref: "Child",
      required: [true, "Child id is required"],
      index: true,
    },
    nurseId: {
      type: mongoose.Schema.ObjectId,
      ref: "Nurse",
      default: null,
    },
    nurseSlotId: {
      type: mongoose.Schema.ObjectId,
      ref: "NurseSlot",
      default: null,
    },
    vaccineId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vaccine",
      required: [true, "Vaccine id is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected", "Delivered"],
      default: "Pending",
    },
    vaccinationDate: {
      type: Date,
      required: [true, "Vaccination date is required"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^(\+?20|0)?1[0125]\d{8}$|^(\+?966|0)?5\d{8}$/.test(v); // For EG and SA numbers
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    governorate: {
      type: String,
      trim: true,
      required: true,
      minlength: [4, "Address governorate must be at least 4 characters"],
      maxlength: [30, "Address governorate must be of 30 characters maximum"],
    },
    city: {
      type: String,
      trim: true,
      required: true,
      minlength: [4, "Address city must be at least 4 characters"],
      maxlength: [50, "Address city must be of 50 characters maximum"],
    },
    street: {
      type: String,
      trim: true,
      required: true,
      minlength: [4, "Address street must be at least 4 characters"],
      maxlength: [100, "Address street must be of 100 characters maximum"],
    },
    buildingNumber: {
      type: Number,
      required: true,
      min: [1, "Building number must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Building number must be an integer",
      },
    },
    apartmentNumber: {
      type: Number,
      required: true,
      min: [1, "Appartment number must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Apartment number must be an integer",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add compound unique index for userId + vaccineId + childId + vaccineRequestId
vaccineRequestSchema.index(
  { parentId: 1, _id: 1, vaccineId: 1, childId: 1 },
  { unique: true }
);

const VaccineRequest = mongoose.model("Vaccine-Request", vaccineRequestSchema);
export default VaccineRequest;
