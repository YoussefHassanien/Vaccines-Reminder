import { Router } from "express";
const productsRouter = Router();
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  createProductLimiter,
  getAllProductsLimiter,
  productQuantityUpdateLimiter,
  productDeletionLimiter,
} from "./rateLimiter.js";
import {
  createNewProduct,
  retrieveAllProducts,
  modifyProductQuantity,
  eraseProduct,
} from "./controller.js";
import {
  createProductValidator,
  productQuantityUpdateValidator,
  productDeletionValidator,
} from "./validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

productsRouter.post(
  "/admin/add",
  createProductLimiter,
  isAuthenticated,
  isAuthorized,
  (req, res, next) => {
    multerUploadHandler.single("image")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  createProductValidator,
  createNewProduct
);

productsRouter.get("/", getAllProductsLimiter, retrieveAllProducts);

productsRouter.patch(
  "/admin/update-quantity/:id",
  productQuantityUpdateLimiter,
  isAuthenticated,
  isAuthorized,
  productQuantityUpdateValidator,
  modifyProductQuantity
);

productsRouter.delete(
  "/admin/delete/:id",
  productDeletionLimiter,
  isAuthenticated,
  isAuthorized,
  productDeletionValidator,
  eraseProduct
);
export default productsRouter;
