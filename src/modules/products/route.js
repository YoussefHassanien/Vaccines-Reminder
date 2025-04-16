import { Router } from "express";
const productsRouter = Router();
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import { createProductLimiter } from "./rateLimiter.js";
import { createNewProduct, retrieveAllProducts } from "./controller.js";
import { validateProduct } from "./validation.js";

productsRouter.post(
  "/admin/add",
  createProductLimiter,
  (req, res, next) => {
    multerUploadHandler.single("image")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  validateProduct,
  createNewProduct
);

productsRouter.get("/", retrieveAllProducts);

export default productsRouter;
