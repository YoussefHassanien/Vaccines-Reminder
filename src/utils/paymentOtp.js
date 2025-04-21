import crypto from "crypto";

/**
 * Generates a cryptographically secure random 6-digit code for OTP verification
 * @returns {string} A secure 6-digit numeric code as string
 */
export const generatePaymentOtp = () => {
  // Generate a cryptographically secure random number
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 24 bits
  const randomNumber = parseInt(randomBytes.toString("hex"), 16) % 1000000;

  // Convert to string and pad with leading zeros if needed
  return randomNumber.toString().padStart(6, "0");
};
