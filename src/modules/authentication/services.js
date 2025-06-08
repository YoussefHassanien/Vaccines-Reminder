// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPasswordById,
  saveResetOTP,
  generateResetToken,
  verifyResetToken,
  clearResetToken,
} from "./repository.js";
import { createToken } from "../../utils/createToken.js";
import { sendEmail } from "../../utils/email.js"; // You'll need to create this utility

export const signupService = async (data) => {
  const user = await createUser({ ...data, role: "parent" });
  const token = createToken(user._id);
  return {
    status: "success",
    token,
    role: user.role,
  };
};

export const loginService = async ({ email, password }, next) => {
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  const token = createToken(user._id);
  return {
    status: "success",
    token,
    role: user.role,
  };
};

export const updatePasswordService = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user = await findUserById(userId);
  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    throw new ApiError("Invalid old password", 401);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  await updateUserPasswordById(userId, hashedNewPassword);

  return {
    status: "success",
    message: "Password updated successfully",
  };
};

export const protectService = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError("Please login to get access", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new ApiError("User not found", 401));
    }


    // Attach user to request for use in route handler
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError("Unauthorized", 401));
  }
};

export const allowedToService = (user, roles, next) => {
  if (!roles.includes(user.role)) {
    return next(new ApiError("You are not allowed to access this route", 403));
  }
};

/**
 * Generate and send password reset OTP
 * @param {string} email - User's email
 * @returns {Promise<Object>} Result of the OTP generation
 */
export const forgotPasswordService = async (email) => {
  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError("No user found with this email", 404);
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP expiration time (10 minutes from now)
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Save OTP and expiration time in user document
  await saveResetOTP(user._id, otp, otpExpires);

  // Send email with OTP
  try {
    await sendEmail({
      to: user.email,
      subject: "🔐 Password Reset Verification Code - Baby-Guard",
      text: `Your verification code for password reset is: ${otp}. This code expires in 10 minutes. If you didn't request this, please ignore this email.`,
      html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="font-size: 28px;">🔐</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Password Reset Request</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #1a202c;">Hello ${
              user.fName
            },</h2>
            <p style="margin: 0; font-size: 16px; color: #4a5568; line-height: 1.6;">
              We received a request to reset the password for your <strong style="color: #2d3748;">Baby-Guard</strong> account. Use the verification code below to proceed with your password reset.
            </p>
          </div>
          
          <!-- OTP Code Section -->
          <div style="text-align: center; margin: 40px 0;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a5568; font-weight: 500;">Your verification code:</p>
            <div style="display: inline-block; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px 30px; margin: 0 auto;">
              <div style="font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #2b6cb0; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            <div style="margin-top: 20px; padding: 15px; background-color: #fef5e7; border-left: 4px solid #f6ad55; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #744210; font-weight: 500;">
                ⏰ This code expires in <strong>10 minutes</strong>
              </p>
            </div>
          </div>
          
          <!-- Security Notice -->
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: flex-start;">
              <div style="margin-right: 12px; margin-top: 2px;">
                <span style="font-size: 18px;">🛡️</span>
              </div>
              <div>
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #2d3748;">Security Notice</h3>
                <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.5;">
                  If you didn't request this password reset, please ignore this email. Your account remains secure and no changes have been made.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Support -->
          <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 20px 0; font-size: 15px; color: #4a5568;">
              Need help? Contact our support team or visit our help center.
            </p>
            <p style="margin: 0; font-size: 16px; color: #2d3748;">
              Best regards,<br>
              <strong style="color: #2b6cb0;">The Baby-Guard Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 13px; color: #718096; line-height: 1.5;">
            © ${new Date().getFullYear()} Baby-Guard. All rights reserved.<br>
            This email was sent to ${user.email}
          </p>
        </div>
        
      </div>
      
      <!-- Spacer for mobile -->
      <div style="height: 40px;"></div>
    </div>
  `,
    });
  } catch (error) {
    throw new ApiError("Failed to send OTP email. Please try again.", 500);
  }

  return {
    status: "success",
    message: "OTP sent to your email",
  };
};

/**
 * Verify password reset OTP and generate reset token
 * @param {string} email - User's email
 * @param {string} otp - OTP code to verify
 * @returns {Promise<Object>} Result with reset token
 */
export const verifyForgotPasswordOTPService = async (email, otp) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError("No user found with this email", 404);
  }

  // Check if OTP exists and is not expired
  if (!user.forgotPasswordOTP || !user.forgotPasswordOTPExpires) {
    throw new ApiError("No OTP requested for this account", 400);
  }

  // Check if OTP is expired
  if (Date.now() > user.forgotPasswordOTPExpires) {
    throw new ApiError("OTP has expired. Please request a new one.", 400);
  }

  // Verify OTP
  if (user.forgotPasswordOTP !== otp) {
    throw new ApiError("Invalid OTP", 400);
  }

  // Generate reset token
  const resetToken = await generateResetToken(user._id);

  return {
    status: "success",
    message: "OTP verified successfully",
    resetToken: resetToken,
    expiresIn: "15 minutes",
  };
};

/**
 * Reset user password using reset token
 * @param {string} resetToken - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result of the password reset
 */
export const resetPasswordService = async (resetToken, newPassword) => {
  // Verify reset token
  const user = await verifyResetToken(resetToken);

  if (!user) {
    throw new ApiError("Invalid or expired reset token", 400);
  }

  // Update user's password
  user.password = newPassword;
  await user.save();

  // Clear reset token
  await clearResetToken(user._id);

  return {
    status: "success",
    message: "Password reset successfully",
  };
};
