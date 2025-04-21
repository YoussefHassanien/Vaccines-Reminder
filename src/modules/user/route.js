import { Router } from "express";
import { getCurrentUser } from "./controller.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

const userRoute = Router();

userRoute.get("/me", isAuthenticated, getCurrentUser);

export default userRoute;
