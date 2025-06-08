import { Router } from "express";
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
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
  uploadCertificateToVaccineRequest,
  getVaccineCertificate,
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

vaccineRequestsRouter.post(
  "/certificate/admin/:vaccineRequestId",
  isAuthenticated,
  isAuthorized,
  (req, res, next) => {
    multerUploadHandler.single("certificate")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  uploadCertificateToVaccineRequest
);

vaccineRequestsRouter.get(
  "/certificate/admin/:vaccineRequestId",
  isAuthenticated,
  getVaccineCertificate
);

export default vaccineRequestsRouter;
