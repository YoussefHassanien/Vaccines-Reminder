import { Router } from "express";
const authrouter = Router();
// import multerUploadHandler from "../../../config/multer.js";
// import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter,
} from "./rateLimiter.js";
import { login, signup, updatePassword } from "./controller.js";
import {
  signupValidator,
  loginValidator,
  updatePasswordValidator,
} from "./validation.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

authrouter.post("/login", loginLimiter, loginValidator, login);

authrouter.post("/signup", signupValidator, signup);
authrouter.put(
  "/updatePassword",
  isAuthenticated,
  updatePasswordValidator,
  updatePassword
);

export default authrouter;
