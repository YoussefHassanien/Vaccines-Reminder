import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      trim: true,
      required: [true, "First name must be provided"],
    },
    lName: {
      type: String,
      trim: true,
      required: [true, "Last name must be provided"],
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email must be provided"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: [true, "Phone number must be unique"],
      required: [true, "Phone number must be provided"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender must be specified"],
    },
    birthDate: {
      type: Date,
      required: [true, "Birth date must be provided"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password must be provided"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["parent", "admin"],
      default: "parent",
    },
    nationalIdNumer: {
      type: Number,
      required: [true, "National id must be provided"],
      unique: [true, "National id number must be unique"],
    },
    governorate: {
      type: String,
      required: [true, "Address governorate must be provided"],
      default: "Cairo",
    },
    city: {
      type: String,
      required: [true, "Address city must be provided"],
      default: "1st Settlment",
    },
    street: {
      type: String,
      required: [true, "Address street must be provided"],
    },
    buildingNumber: {
      type: Number,
      required: [true, "Address building number must be provided"],
    },
    appartmentNumber: {
      type: Number,
      required: [true, "Address appartment number must be provided"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = bcrypt.hashSync(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
