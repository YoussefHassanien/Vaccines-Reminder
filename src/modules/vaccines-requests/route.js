import { Router } from "express";
const vaccineRequestsRouter = Router();
import {
  createVaccineRequestLimiter,
  retrieveVaccineRequestsLimiter,
} from "./rateLimiter.js";
import { createVaccineRequest, retrieveVaccineRequests } from "./controller.js";
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
  "/admin",
  retrieveVaccineRequestsLimiter,
  isAuthenticated,
  isAuthorized,
  retrieveVaccineRequests
);

export default vaccineRequestsRouter;
