import { Router } from "express";
const authrouter = Router();
// import multerUploadHandler from "../../../config/multer.js";
// import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter,
} from "./rateLimiter.js";
import { login, signup } from "./controller.js";
import { signupValidator, loginValidator } from "./validation.js";

authrouter.post("/login", loginLimiter, loginValidator, login);

authrouter.post("/signup", signupValidator, signup);

export default authrouter;
