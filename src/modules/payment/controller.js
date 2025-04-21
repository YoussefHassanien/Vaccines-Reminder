import { generatePaymentOtp } from "../../utils/paymentOtp.js";
import {
  verifyOtp,
  sendOtpViaTwilio,
  removePaymentOtp,
  insertPaymentOtp,
} from "./services.js";

export const sendPaymentOtp = async (req, res) => {
  const user = req.user;
  const code = generatePaymentOtp();
  const { cartId } = req.body;
  try {
    const paymentOtp = await insertPaymentOtp({ cartId, code });
    if (!paymentOtp) {
      return res.status(400).json({ message: "Could not insert payment otp" });
    }
    const { status, message, data, error } = await sendOtpViaTwilio(
      user.phoneNumber,
      code
    );
    return res.status(status).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error.error,
    });
  }
};
