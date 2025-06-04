import { Router } from "express";
const vaccineRequestsRouter = Router();
import {
  createVaccineRequestLimiter,
  retrieveVaccineRequestsLimiter,
  retrieveUserVaccineRequestsLimiter,
  cancelUserVaccineRequestLimiter,
} from "./rateLimiter.js";
import {
  createVaccineRequest,
  retrieveVaccineRequests,
  retrieveUserVaccineRequests,
  cancelUserVaccineRequest,
} from "./controller.js";
import {
  createVaccineRequestValidator,
  cancelUserVaccineRequestValidator,
} from "./validation.js";
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

vaccineRequestsRouter.delete(
  "/:vaccineRequestId",
  cancelUserVaccineRequestLimiter,
  isAuthenticated,
  cancelUserVaccineRequestValidator,
  cancelUserVaccineRequest
);

vaccineRequestsRouter.get(
  "/admin",
  retrieveVaccineRequestsLimiter,
  isAuthenticated,
  isAuthorized,
  retrieveVaccineRequests
);

export default vaccineRequestsRouter;
