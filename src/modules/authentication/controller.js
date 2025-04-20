// controllers/auth.controller.js
import asyncHandler from "express-async-handler";
import { signupService, loginService } from "./services.js";

export const signup = asyncHandler(async (req, res, next) => {
  const result = await signupService(req.body);
  res.status(201).json(result);
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
