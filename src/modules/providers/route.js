import { Router } from "express";
import { addNewProviderValidator } from "./validation.js";
import { addProvider } from "./controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const providerRoute = Router();

providerRoute.post("/", isAuthenticated, addNewProviderValidator, addProvider);

export default providerRoute;
