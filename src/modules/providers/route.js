import { Router } from "express";
import { addNewProviderValidator } from "./validation.js";
import {
  addNewProviderLimiter,
  fetchAllProvidersLimiter,
  fetchProviderByIdLimiter,
} from "./rateLimiter.js";
import { addProvider, getAllProviders, getProviderById } from "./controller.js";
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
providerRoute.get(
  "/",
  isAuthenticated,
  fetchAllProvidersLimiter,
  getAllProviders
);
providerRoute.get(
  "/:id",
  isAuthenticated,
  fetchProviderByIdLimiter,
  getProviderById
);

export default providerRoute;
