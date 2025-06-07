import {
  getAllTips,
  createMilestone,
  createPregnancyTip,
  createRecommendedFood,
  createTrimester,
  deleteMilestone,
  deletePregnancyTip,
  deleteRecommendedFood,
  deleteTrimester,
} from "./controller.js";
import {
  createMilestoneValidator,
  createPregnancyTipValidator,
  createTrimesterValidator,
  createRecommendedFoodValidator,
} from "./validation.js";
import { Router } from "express";
import multerUploadHandler from "../../../config/multer.js";
import multerErrorHandler from "../../middlewares/multerErrorHandler.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";

const tipsRouter = Router();
tipsRouter.get("/", getAllTips);
tipsRouter.post(
  "/milestone",
  isAuthenticated,
  isAuthorized,
  createMilestoneValidator,
  createMilestone
);
tipsRouter.delete(
  "/milestone/:id",
  isAuthenticated,
  isAuthorized,
  deleteMilestone
);

tipsRouter.post(
  "/pregnancy-tip",
  isAuthenticated,
  isAuthorized,
  createPregnancyTipValidator,
  createPregnancyTip
);
tipsRouter.delete(
  "/pregnancy-tip/:id",
  isAuthenticated,
  isAuthorized,
  deletePregnancyTip
);
tipsRouter.post(
  "/trimester",
  isAuthenticated,
  isAuthorized,
  createTrimesterValidator,
  createTrimester
);
tipsRouter.delete(
  "/trimester/:id",
  isAuthenticated,
  isAuthorized,
  deleteTrimester
);
tipsRouter.post(
  "/recommended-food",
  isAuthenticated,
  isAuthorized,
  (req, res, next) => {
    multerUploadHandler.single("image")(req, res, (err) => {
      multerErrorHandler(err, req, res, next);
    });
  },
  createRecommendedFoodValidator,
  createRecommendedFood
);
tipsRouter.delete(
  "/recommended-food/:id",
  isAuthenticated,
  isAuthorized,
  deleteRecommendedFood
);
export default tipsRouter;
