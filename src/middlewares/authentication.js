import jwt from "jsonwebtoken";
import { findUserById } from "../modules/authentication/repository.js";

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(400).json({
      message: "No Token Provided!",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized Access: No User found!",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Unauthorized Access: Token Expired!",
        error: error.message,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Unauthorized Access: Invalid Token!",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error during token verification.",
      error: error.message,
    });
  }
};

export const isAuthorized = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized Access: No User found!",
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized Access: Permission Not Granted!",
    });
  }
  next();
};
