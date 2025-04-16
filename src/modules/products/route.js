import { Router } from "express";
const productsRouter = Router();
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  createProductLimiter,
  getPaginatedProductsLimiter,
  productQuantityUpdateLimiter,
  productDeletionLimiter,
} from "./rateLimiter.js";
import {
  createNewProduct,
  retrievePaginatedProducts,
  modifyProductQuantity,
  eraseProduct,
} from "./controller.js";
import {
  createProductValidator,
  getPaginatedProductsValidator,
  productQuantityUpdateValidator,
  productDeletionValidator,
} from "./validation.js";

productsRouter.post(
  "/admin/add",
  createProductLimiter,
  (req, res, next) => {
    multerUploadHandler.single("image")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  createProductValidator,
  createNewProduct
);

productsRouter.get(
  "/",
  getPaginatedProductsLimiter,
  getPaginatedProductsValidator,
  retrievePaginatedProducts
);

productsRouter.patch(
  "/admin/update-quantity/:id",
  productQuantityUpdateLimiter,
  productQuantityUpdateValidator,
  modifyProductQuantity
);

productsRouter.delete(
  "/admin/delete/:id",
  productDeletionLimiter,
  productDeletionValidator,
  eraseProduct
);
export default productsRouter;
