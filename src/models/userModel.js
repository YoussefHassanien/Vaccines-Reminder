import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    apartmentNumber: {
      type: Number,
      required: [true, "Address appartment number must be provided"],
    },
    // Forgot password fields
    forgotPasswordOTP: {
      type: String,
      default: null,
    },
    forgotPasswordOTPExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
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
userSchema.methods.createPasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.passwordResetOTPExpiresAt = Date.now() + 10 * 60 * 1000;
  return otp;
};

export default mongoose.model("User", userSchema);
