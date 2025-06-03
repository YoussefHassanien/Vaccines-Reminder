// controllers/auth.controller.js
import asyncHandler from "express-async-handler";
import {
  getCurrentUserService,
  getAllUsersService,
  deleteUserService,
  updateUserService,
} from "./services.js";

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const result = await getCurrentUserService(req.user._id);
  res.status(200).json(result);
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const result = await getAllUsersService();
  res.status(200).json(result);
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const result = await deleteUserService(userId);
  res.status(200).json(result);
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const updateData = req.body;
  const result = await updateUserService(userId, updateData);
  res.status(200).json(result);
});
export const updateCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const updateData = req.body;
  const result = await updateUserService(userId, updateData);
  res.status(200).json(result);
});
