import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import { check } from "express-validator";
import Child from "../../models/childModel.js";

export const createChildValidator = [
  check("name").notEmpty().withMessage("child name required"),
  check("birthDate")
    .notEmpty()
    .withMessage("child birthdate is required")
    .isDate()
    .withMessage("please enter a valid date"),
  check("gender")
    .notEmpty()
    .withMessage("gender is required")
    .isIn(["male", "female"])
    .withMessage("invalid gender please try again"),
  check("bloodType")
    .notEmpty()
    .withMessage("blood type is required")
    .isIn([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "I don't know",
      "Prefer not to say",
    ])
    .withMessage("invalid blood type"),
  check("ssn")
    .notEmpty()
    .withMessage("SSN is required")
    .isLength({ min: 14, max: 14 })
    .withMessage("SSN must be exactly 14 digits")
    .matches(/^\d+$/)
    .withMessage("SSN must be numeric")
    .custom((value) =>
      Child.findOne({ ssn: value }).then((child) => {
        if (child) {
          return Promise.reject("SSN already exists");
        }
      })
    ),
  validatorMiddleware,
];
