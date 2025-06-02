import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

/**
 * Validates complaint creation
 */
export const createComplaintValidator = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .bail()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters")
    .bail()
    .trim()
    .escape(),

  body("type")
    .notEmpty()
    .withMessage("Complaint type is required")
    .bail()
    .isIn(["Complaint", "Suggestion", "Question"])
    .withMessage(
      "Invalid complaint type. Must be one of: Complaint, Suggestion, Question"
    )
    .bail()
    .trim()
    .escape(),

  validatorMiddleware,
];
