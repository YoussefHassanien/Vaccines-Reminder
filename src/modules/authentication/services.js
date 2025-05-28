// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPasswordById,
} from "./repository.js";
import { createToken } from "../../utils/createToken.js";

export const signupService = async (data) => {
  const user = await createUser({ ...data, role: "parent" });
  const token = createToken(user._id);
  return {
    status: "success",
    token,
    role: user.role,
  };
};

export const loginService = async ({ email, password }, next) => {
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  const token = createToken(user._id);
  return {
    status: "success",
    token,
    role: user.role,
  };
};

export const updatePasswordService = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user = await findUserById(userId);
  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    throw new ApiError("Invalid old password", 401);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  await updateUserPasswordById(userId, hashedNewPassword);

  return {
    status: "success",
    message: "Password updated successfully",
  };
};

export const protectService = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError("Please login to get access", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new ApiError("User not found", 401));
    }


    // Attach user to request for use in route handler
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError("Unauthorized", 401));
  }
};

export const allowedToService = (user, roles, next) => {
  if (!roles.includes(user.role)) {
    return next(new ApiError("You are not allowed to access this route", 403));
  }
};
