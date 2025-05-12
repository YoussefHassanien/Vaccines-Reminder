import { Router } from "express";
import { addNewProviderValidator } from "./validation.js";
import { addNewProviderLimiter } from "./rateLimiter.js";
import { addProvider } from "./controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const providerRoute = Router();

providerRoute.post(
  "/admin/add",
  addNewProviderLimiter,
  isAuthenticated,
  isAuthorized,
  addNewProviderValidator,
  addProvider
);

export default providerRoute;
