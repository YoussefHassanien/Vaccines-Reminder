// controllers/auth.controller.js
import asyncHandler from "express-async-handler";
import {
  signupService,
  loginService,
  updatePasswordService,
  forgotPasswordService,
  verifyForgotPasswordOTPService,
  resetPasswordService,
} from "./services.js";

export const signup = asyncHandler(async (req, res, next) => {
  const result = await signupService(req.body);
  res.status(201).json(result);
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
  const result = await updatePasswordService(userId, oldPassword, newPassword);
  res.status(200).json(result);
});

export const login = asyncHandler(async (req, res, next) => {
  const result = await loginService(req.body, next);
  res.status(200).json(result);
});

export const protect = asyncHandler(async (req, res, next) => {
  const user = await protectService(req.headers, next);
  req.user = user;
  next();
});

export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    allowedToService(req.user, roles, next);
    next();
  });

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPasswordService(email);

  res.status(200).json({
    status: result.status,
    message: result.message,
  });
});

export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await verifyForgotPasswordOTPService(email, otp);

  res.status(200).json({
    status: result.status,
    message: result.message,
    data: {
      resetToken: result.resetToken,
      expiresIn: result.expiresIn,
    },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const result = await resetPasswordService(resetToken, newPassword);

  res.status(200).json({
    status: result.status,
    message: result.message,
  });
});
