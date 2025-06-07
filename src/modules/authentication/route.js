import { Router } from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  updatePassword,
} from "./controller.js";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyOTPValidator,
  updatePasswordValidator,
} from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const authRouter = Router();

// Authentication routes
authRouter.post("/signup", signup);
authRouter.post("/login", login);

// Update Password route
authRouter.put(
  "/update-password",
  isAuthenticated,
  updatePasswordValidator,
  updatePassword
);

// Forgot Password routes
authRouter.post("/forgot-password", forgotPasswordValidator, forgotPassword);
authRouter.post("/verify-otp", verifyOTPValidator, verifyForgotPasswordOTP);
authRouter.post("/reset-password", resetPasswordValidator, resetPassword);

export default authRouter;
