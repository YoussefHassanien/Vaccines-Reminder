import { token } from "morgan";
import User from "../../models/userModel.js";
import crypto from "crypto";

/**
 * Create and save a new user in the database
 * @param {Object} userData - User information
 * @returns {Promise<Object>} Created user document
 */
export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Find a user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} Found user document or null
 */
export const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error(`Error finding user by email (${email}):`, error);
    throw error;
  }
};

/**
 * Find a user by ID
 * @param {string} id - User's ID
 * @returns {Promise<Object|null>} Found user document or null
 */
export const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(`Error finding user by ID (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {string} id - User's ID
 * @returns {Promise<Object|null>} Deleted user document or null
 */
export const deleteUserById = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting user by ID (${id}):`, error);
    throw error;
  }
};

/**
 * Update user by ID
 * @param {string} id - User's ID
 * @param {Object} updateData - Updated fields
 * @returns {Promise<Object|null>} Updated user document or null
 */
export const updateUserById = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error(`Error updating user by ID (${id}):`, error);
    throw error;
  }
};

/**
 * update user password by ID
 * @param {string} id - User's ID
 * @param {string} newPassword - New password
 * @returns {Promise<Object|null>} Updated user document or null
 */
export const updateUserPasswordById = async (id, newPassword) => {
  try {
    return await User.findByIdAndUpdate(
      id,
      { password: newPassword },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    console.error(`Error updating user password by ID (${id}):`, error);
    throw error;
  }
};

/**
 * check forgot password OTP
 * @param {string} userId
 * @param {number} otp
 * @returns {Promise<Object>} Result of the OTP check
 */
export const checkForgotPasswordOTP = async (userId, otp) => {
  const user = await getUser(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  if (
    user.forgotPasswordOTP !== otp ||
    Date.now() > user.forgotPasswordOTPExpires
  ) {
    return {
      status: "error",
      message: "OTP is invalid or has expired",
    };
  }
  return {
    status: "success",
    message: "OTP is valid",
  };
};

export const resetPasswordService = async (userId, newPassword) => {
  const user = await getUser(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  if (!user.forgotPasswordOTP || !user.forgotPasswordOTPExpires) {
    throw new ApiError("No OTP found for password reset", 400);
  }
  if (Date.now() > user.forgotPasswordOTPExpires) {
    throw new ApiError("OTP has expired", 400);
  }

  user.password = newPassword;
  user.forgotPasswordOTP = null;
  user.forgotPasswordOTPExpires = null;

  const updatedUser = await updateUserById(userId, user);

  return {
    status: "success",
    message: "Password reset successfully",
    user: updatedUser,
  };
};

/**
 * reset password
 * @param {string} userId - User's ID
 * @param {string} newPassword - User's new password
 * @returns {Promise<Object>} Result of the password reset operation
 */
export const resetPassword = async (userId, newPassword) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    user.password = newPassword;
    user.forgotPasswordOTP = undefined;
    user.forgotPasswordOTPExpires = undefined;
    await user.save();

    return {
      status: "success",
      message: "Password reset successfully",
      user,
    };
  } catch (error) {
    console.error(`Error resetting password for user (${userId}):`, error);
    throw error;
  }
};

/**
 * Save reset password OTP and expiration time
 * @param {string} userId - User's ID
 * @param {string} otp - Generated OTP
 * @param {Date} expiryDate - OTP expiration date
 * @returns {Promise<Object>} Updated user document
 */
export const saveResetOTP = async (userId, otp, expiryDate) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      {
        forgotPasswordOTP: otp,
        forgotPasswordOTPExpires: expiryDate,
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error saving reset OTP for user (${userId}):`, error);
    throw error;
  }
};

/**
 * Generate and save reset password token
 * @param {string} userId - User's ID
 * @returns {Promise<string>} Generated reset token
 */

export const generateResetToken = async (userId) => {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpires: tokenExpires,
        $unset: {
          forgotPasswordOTP: "",
          forgotPasswordOTPExpires: "",
        },
      },
      { new: true }
    );

    return resetToken;
  } catch (error) {
    console.error(`Error generating reset token for user (${userId}):`, error);
    throw error;
  }
};

/**
 * Verify reset password token
 * @param {string} token - Reset token
 * @returns {Promise<Object|null>} User document if token is valid, null otherwise
 */
export const verifyResetToken = async (token) => {
  try {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });
  } catch (error) {
    console.error(`Error verifying reset token:`, error);
    throw error;
  }
};

/**
 * Clear reset token after password reset
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Updated user document
 */
export const clearResetToken = async (userId) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: undefined,
        resetPasswordTokenExpires: undefined,
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error clearing reset token for user (${userId}):`, error);
    throw error;
  }
};
