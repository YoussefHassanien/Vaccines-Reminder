// controllers/auth.controller.js
import asyncHandler from "express-async-handler";
import { getCurrentUserService } from "./services.js";

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const result = await getCurrentUserService(req.user._id);
  res.status(200).json(result);
});
