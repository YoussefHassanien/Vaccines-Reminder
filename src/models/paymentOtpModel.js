import mongoose from "mongoose";
import bcrypt from "bcrypt";

const paymentOtpSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
      required: [true, "Cart id is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Code must be provided"],
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid otp code! Must be exactly 6 digits.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

paymentOtpSchema.pre("save", function (next) {
  if (!this.isModified("code")) return next();
  try {
    this.code = bcrypt.hashSync(this.code, 12);
    next();
  } catch (err) {
    next(err);
  }
});

paymentOtpSchema.methods.compareCodes = async function (code) {
  return await bcrypt.compare(code, this.code);
};

const PaymentOtp = mongoose.model("Payment-Otp", paymentOtpSchema);
export default PaymentOtp;
