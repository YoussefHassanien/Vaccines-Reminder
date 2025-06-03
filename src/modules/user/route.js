import { Router } from "express";
import {
  getCurrentUser,
  getAllUsers,
  deleteUser,
  updateUser,
  updateCurrentUser,
} from "./controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { updateUserValidator } from "./validation.js";

const userRoute = Router();

userRoute.get("/me", isAuthenticated, getCurrentUser);
userRoute.put("/me", isAuthenticated, updateUserValidator, updateCurrentUser);
userRoute.get("/", isAuthenticated, isAuthorized, getAllUsers);
userRoute.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  updateUserValidator,
  updateUser
);
userRoute.delete("/:id", isAuthenticated, isAuthorized, deleteUser);

export default userRoute;
