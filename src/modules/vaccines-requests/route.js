import { Router } from "express";
const vaccineRequestsRouter = Router();
import {
  createVaccineRequestLimiter,
  retrieveVaccineRequestsLimiter,
  retrieveUserVaccineRequestsLimiter,
} from "./rateLimiter.js";
import {
  createVaccineRequest,
  retrieveVaccineRequests,
  retrieveUserVaccineRequests,
} from "./controller.js";
import { createVaccineRequestValidator } from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

vaccineRequestsRouter.post(
  "/",
  createVaccineRequestLimiter,
  isAuthenticated,
  createVaccineRequestValidator,
  createVaccineRequest
);

vaccineRequestsRouter.get(
  "/",
  retrieveUserVaccineRequestsLimiter,
  isAuthenticated,
  retrieveUserVaccineRequests
);

vaccineRequestsRouter.get(
  "/admin",
  retrieveVaccineRequestsLimiter,
  isAuthenticated,
  isAuthorized,
  retrieveVaccineRequests
);

export default vaccineRequestsRouter;
