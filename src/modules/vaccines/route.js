import { Router } from "express";
const vaccinesRouter = Router();
import {
  createVaccineLimiter,
  retrieveVaccinesForParentLimiter,
} from "./rateLimiter.js";
import { createVaccine, retrieveVaccinesForParent } from "./controller.js";
import { createVaccineValidator } from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

vaccinesRouter.post(
  "/admin/add",
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

export default vaccinesRouter;
