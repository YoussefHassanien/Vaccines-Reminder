// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import { createUser, findUserByEmail, findUserById } from "./repository.js";
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

export const protectService = async (headers, next) => {
  let token;
  if (headers.authorization && headers.authorization.startsWith("bearer")) {
    token = headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("Please login to get access", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await findUserById(decoded.id);
  if (!user) {
    return next(new ApiError("User not found", 401));
  }
  return user;
};

export const allowedToService = (user, roles, next) => {
  if (!roles.includes(user.role)) {
    return next(new ApiError("You are not allowed to access this route", 403));
  }
};
