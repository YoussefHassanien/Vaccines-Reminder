import { generatePaymentOtp } from "../../utils/paymentOtp.js";
import {
  verifyOtp,
  sendOtpViaTwilio,
  removePaymentOtp,
  insertPaymentOtp,
  changeUserCartStatus,
  changePaymentOtpCode,
} from "./services.js";

export const sendPaymentOtp = async (req, res) => {
  const user = req.user;
  const code = generatePaymentOtp();
  const { cartId } = req.params;
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

export const verifyPaymentOtp = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { code, cartId } = req.body;
  try {
    const { status, message, error, data } = await verifyOtp(cartId, code);
    if (status !== 200) {
      return res.status(status).json({
        message,
        error,
      });
    }

    const isUserCartStatusChanged = await changeUserCartStatus(userId, cartId);
    if (!isUserCartStatusChanged) {
      return res.status(400).json({
        message: "Otp is verified but could not change user cart status",
      });
    }

    const isDeltedPaymentOtp = await removePaymentOtp(data.otp._id);
    if (!isDeltedPaymentOtp) {
      return res.status(400).json({
        message:
          "Otp is verified  and changed user cart status but could not be deleted",
      });
    }

    return res.status(status).json({
      message,
      error,
      data: {
        cart: isUserCartStatusChanged,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const resendPaymentOtp = async (req, res) => {
  const user = req.user;
  const code = generatePaymentOtp();
  const { cartId } = req.params;
  try {
    const paymentOtp = await changePaymentOtpCode(cartId, code);
    if (!paymentOtp) {
      return res.status(400).json({ message: "Could not update payment otp" });
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
