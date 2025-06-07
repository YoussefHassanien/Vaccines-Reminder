import { Router } from "express";
const vaccineRequestsRouter = Router();
import {
  createVaccineRequestLimiter,
  retrieveVaccineRequestsLimiter,
  retrieveUserVaccineRequestsLimiter,
  cancelUserVaccineRequestLimiter,
  modifyVaccineRequestStatusLimiter,
} from "./rateLimiter.js";
import {
  createVaccineRequest,
  retrieveVaccineRequests,
  retrieveUserVaccineRequests,
  cancelUserVaccineRequest,
  modifyVaccineRequestStatus,
} from "./controller.js";
import {
  createVaccineRequestValidator,
  cancelUserVaccineRequestValidator,
  modifyVaccineRequestStatusValidator,
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

vaccineRequestsRouter.patch(
  "/status/admin/:vaccineRequestId",
  modifyVaccineRequestStatusLimiter,
  isAuthenticated,
  isAuthorized,
  modifyVaccineRequestStatus
);

export default vaccineRequestsRouter;
