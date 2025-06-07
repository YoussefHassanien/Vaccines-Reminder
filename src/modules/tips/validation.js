import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Milestone from "../../models/milestonesModel.js";

export const createMilestoneValidator = [
  check("weekNumber")
    .notEmpty()
    .withMessage("Week number is required")
    .isNumeric()
    .withMessage("Week number must be a number")
    .custom(async (value, { req }) => {
      if (value < 1 || value > 52) {
        throw new Error("Week number must be between 1 and 52");
      }
      const milestoneExists = await Milestone.findOne({ weekNumber: value });
      if (milestoneExists) {
        throw new Error("Milestone for this week already exists");
      }
      return true;
    }),
  check("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters long")
    .isLength({ max: 500 })
    .withMessage("Content must be at most 500 characters long"),
  ,
  validatorMiddleware,
];

export const createTrimesterValidator = [
  check("number")
    .notEmpty()
    .withMessage("Trimester number is required")
    .isNumeric()
    .withMessage("Trimester number must be a number")
    .isIn([1, 2, 3])
    .withMessage("Trimester number must be 1, 2, or 3"),
  check("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters long")
    .isLength({ max: 500 })
    .withMessage("Content must be at most 500 characters long"),
  validatorMiddleware,
];

export const createPregnancyTipValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 5 characters long")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters long"),
  check("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters long")
    .isLength({ max: 500 })
    .withMessage("Content must be at most 500 characters long"),
  validatorMiddleware,
];

export const createRecommendedFoodValidator = [
  check("name")
    .notEmpty()
    .withMessage("Food name is required")
    .isLength({ min: 3 })
    .withMessage("Food name must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Food name must be at most 20 characters long"),
  validatorMiddleware,
];
