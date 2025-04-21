import { Router } from "express";
const userRoute = Router();
// import multerUploadHandler from "../../../config/multer.js";
// import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter,
} from "./rateLimiter.js";
import { getCurrentUser } from "./controller.js";
import { signupValidator, loginValidator } from "./validation.js";
import {
  protectService,
  allowedToService,
} from "../authentication/services.js";

userRoute.get("/me", protectService, getCurrentUser);

export default userRoute;
