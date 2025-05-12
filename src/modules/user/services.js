// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import { getUser } from "./repository.js";
import { createToken } from "../../utils/createToken.js";

export const getCurrentUserService = async (userId) => {
  const user = await getUser(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return {
    status: "success",
    user: user,
  };
};
