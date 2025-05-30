// validation layer functions
import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Nurse from "../../models/nurseModel.js";

export const createNurseValidator = [
  check("fName")
    .notEmpty()
    .withMessage("First name must be specified")
    .isLength({ min: 3 })
    .withMessage("First name is too short")
    .isLength({ max: 15 })
    .withMessage("First name is too long"),
  check("lName")
    .notEmpty()
    .withMessage("First name must be specified")
    .isLength({ min: 3 })
    .withMessage("First name is too short")
    .isLength({ max: 15 })
    .withMessage("First name is too long"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .custom((value) =>
      Nurse.findOne({ email: value }).then((nurse) => {
        if (nurse) {
          return Promise.reject("Email already in use");
        }
      })
    ),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{11}$/)
    .withMessage("Phone number must be 11 digits")
    .custom((value) =>
      Nurse.findOne({ phone: value }).then((nurse) => {
        if (nurse) {
          return Promise.reject("Phone number already exists");
        }
      })
    ),
  check("hospitalName")
    .notEmpty()
    .withMessage("Hospital name must be provided")
    .trim(),
  check("profileImage")
    .optional()
    .notEmpty()
    .withMessage("Profile image URL must be provided"),

  validatorMiddleware,
];
