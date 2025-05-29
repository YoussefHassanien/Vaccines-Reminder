import { Router } from "express";
const vaccinesRouter = Router();
import {
  createVaccineLimiter,
  retrieveVaccinesForParentLimiter,
  deleteVaccineLimiter,
} from "./rateLimiter.js";
import {
  createVaccine,
  retrieveVaccinesForParent,
  eraseVaccine,
} from "./controller.js";
import {
  createVaccineValidator,
  deleteVaccineValidator,
} from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

vaccinesRouter.post(
  "/admin",
  createVaccineLimiter,
  isAuthenticated,
  isAuthorized,
  createVaccineValidator,
  createVaccine
);

vaccinesRouter.get(
  "/",
  retrieveVaccinesForParentLimiter,
  isAuthenticated,
  retrieveVaccinesForParent
);

// Delete vaccine endpoint (Admin only)
vaccinesRouter.delete(
  "/admin/:vaccineId",
  deleteVaccineLimiter,
  isAuthenticated,
  isAuthorized,
  deleteVaccineValidator,
  eraseVaccine
);

export default vaccinesRouter;
