import { Router } from "express";
const productsRouter = Router();
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import { createProductLimiter } from "./rateLimiter.js";
import { createNewProduct } from "./controller.js";

productsRouter.post(
  "/admin/add",
  createProductLimiter,
  (req, res, next) => {
    multerUploadHandler.single("image")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  createNewProduct
);

export default productsRouter;
