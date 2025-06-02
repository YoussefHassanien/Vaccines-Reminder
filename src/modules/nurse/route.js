import { Router } from "express";
import {
  createNewNurse,
  getAllPaginatedNurses,
  getNurseSlots,
  assignNurseToVaccineRequest,
  getFreeNurseSlotsById,
  deleteNurse,
} from "./controller.js";
import { createNurseValidator } from "./validation.js";
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const nurseRouter = Router();

nurseRouter.get("/", isAuthenticated, isAuthorized, getAllPaginatedNurses);

nurseRouter.post(
  "/",
  isAuthenticated,
  isAuthorized,
  (req, res, next) => {
    multerUploadHandler.single("image")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  createNurseValidator,
  createNewNurse
);
nurseRouter.get(
  "/:nurseId/slots",
  isAuthenticated,
  isAuthorized,
  getNurseSlots
);
nurseRouter.post(
  "/:nurseId/assign",
  isAuthenticated,
  isAuthorized,
  assignNurseToVaccineRequest
);

nurseRouter.get(
  "/:nurseId/free-slots",
  isAuthenticated,
  isAuthorized,
  getFreeNurseSlotsById
);
nurseRouter.delete("/:id", isAuthenticated, isAuthorized, deleteNurse);

export default nurseRouter;
