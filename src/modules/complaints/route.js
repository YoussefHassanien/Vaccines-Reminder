import { Router } from "express";
const complaintsRouter = Router();
import {
  createComplaintLimiter,
  retrieveComplaintsLimiter,
} from "./rateLimiter.js";
import { createComplaint, retrieveComplaints } from "./controller.js";
import { createComplaintValidator } from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

complaintsRouter.post(
  "/",
  createComplaintLimiter,
  isAuthenticated,
  createComplaintValidator,
  createComplaint
);

complaintsRouter.get(
  "/admin",
  retrieveComplaintsLimiter,
  isAuthenticated,
  isAuthorized,
  retrieveComplaints
);

export default complaintsRouter;
