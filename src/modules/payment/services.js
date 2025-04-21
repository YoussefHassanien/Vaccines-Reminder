import twilio from "twilio";
import {
  addPaymentOtp,
  getPaymentOtpByCartId,
  deletePaymentOtp,
  updateUserCartStatus,
} from "./repository.js";

/**
 * Sends an OTP code to the user's phone via Twilio
 * @param {string} phoneNumber - The user's phone number (with country code)
 * @param {string} otpCode - The 6-digit OTP code to send
 * @returns {Promise<boolean>} Promise that resolves with true on sending otp successfully
 */
export const sendOtpViaTwilio = async (phoneNumber, otpCode) => {
  // Initialize Twilio client
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const twilioMessage = await twilioClient.messages.create({
      body: `Baby-Guard payment verification code is: *${otpCode}*. For your security, do not share this code. *This OTP will expire in 2 minutes!*`,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
    });
    return {
      status: 201,
      message: `Otp is successfully sent to phone number: ${phoneNumber}`,
      data: {
        message: twilioMessage.body,
      },
    };
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return {
      status: 500,
      message: "Error sending otp",
      error: error.message,
    };
  }
};

/**
 * Verify the OTP code provided by the user
 * @param {string} cartId - Cart ID associated with the OTP
 * @param {string} userProvidedCode - Code provided by the user
 * @returns {Promise} Promise with the verification result
 */
export const verifyOtp = async (cartId, userProvidedCode) => {
  try {
    // Find the stored OTP
    const otpRecord = await getPaymentOtpByCartId(cartId);

    if (!otpRecord) {
      return {
        status: 400,
        message: "OTP has expired",
      };
    }

    // Check if OTP is expired (3 minutes)
    const threeMinutesAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const isExpired = otpRecord.updatedAt < threeMinutesAgo;

    if (isExpired) {
      return {
        status: 400,
        message: "OTP has expired",
      };
    }

    // Check if OTP matches
    const isValid = otpRecord.compareCodes(userProvidedCode);

    if (!isValid) {
      return {
        status: 403,
        message: "Invalid OTP code",
      };
    }

    return {
      status: 200,
      message: "OTP verified successfully",
    };
  } catch (error) {
    console.error("OTP verification failed:", error);
    return {
      message: "Payment OTP verification failed",
      error: error.message,
    };
  }
};

export const removePaymentOtp = async (id) => {
  try {
    const isDeleted = await deletePaymentOtp(id);
    if (!isDeleted) {
      return false;
    }
    return true;
  } catch (error) {
    return {
      message: "Error deleting payment otp",
      error: error.message,
    };
  }
};

export const insertPaymentOtp = async (paymentOtpData) => {
  try {
    const paymentOtp = await addPaymentOtp(paymentOtpData);
    if (!paymentOtp) {
      return false;
    }
    return true;
  } catch (error) {
    return {
      message: "Error inserting payment otp",
      error: error.message,
    };
  }
};

export const changeUserCartStatus = async (userId, cartId) => {
  try {
    const userCart = await updateUserCartStatus(userId, cartId);
    if (!userCart) {
      return false;
    }
    return true;
  } catch (error) {
    return {
      message: `Error updating user cart status of user id: ${userId} and cart id: ${cartId}`,
      error: error.message,
    };
  }
};
