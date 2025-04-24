import { Router } from "express";
import {
  addNewChild,
  deleteChild,
  retrievePaginatedChildren,
  retriveCurrentUserChildren,
} from "./controller.js";
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import { createChildValidator } from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const childRouter = Router();

childRouter.post(
  "/",
  isAuthenticated,
  (req, res, next) => {
    multerUploadHandler.single("birthCertificate")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  createChildValidator,
  addNewChild
);
childRouter.get("/", isAuthenticated, isAuthorized, retrievePaginatedChildren);
childRouter.get("/me", isAuthenticated, retriveCurrentUserChildren);
childRouter.delete("/:id", isAuthenticated, deleteChild);

export default childRouter;
