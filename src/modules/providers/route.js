import { Router } from "express";
import {
  addNewProviderValidator,
  findProviderByIdValidator,
  updateProviderValidator,
} from "./validation.js";
import {
  addNewProviderLimiter,
  fetchAllProvidersLimiter,
  fetchProviderByIdLimiter,
} from "./rateLimiter.js";
import {
  addProvider,
  getAllProviders,
  getProviderById,
  updateProviderById,
  deleteProviderById,
} from "./controller.js";
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
  findProviderByIdValidator,
  getProviderById
);
providerRoute.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  findProviderByIdValidator,
  updateProviderValidator,
  updateProviderById
);
providerRoute.delete(
  "/:id",
  isAuthenticated,
  isAuthorized,
  findProviderByIdValidator,
  deleteProviderById
);

export default providerRoute;
