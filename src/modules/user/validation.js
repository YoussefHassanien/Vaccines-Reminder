// validation layer functions
import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";
export const updateUserValidator = [
  check("fName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("First name is too short")
    .isLength({ max: 15 })
    .withMessage("First name is too long")
    .custom((value, { req }) => {
      if (value && req.body.lName) {
        req.body.slug = slugify(
          value + "-" + req.body.lName + "-" + `${Date.now()}`,
          {
            lower: true,
            trim: true,
            remove: /[^\w-]+/g,
          }
        )
          .replace(/--+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return true;
    }),

  check("lName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Last name is too short")
    .isLength({ max: 15 })
    .withMessage("Last name is too long"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Email is invalid")
    .custom((value, { req }) =>
      User.findOne({ email: value }).then((user) => {
        if (user && user._id.toString() !== req.user._id.toString()) {
          return Promise.reject("Email already in use");
        }
      })
    ),

  check("nationalIdNumer")
    .optional()
    .isLength({ min: 14, max: 14 })
    .withMessage("SSN must be exactly 14 digits")
    .matches(/^\d+$/)
    .withMessage("SSN must be numeric")
    .custom((value, { req }) =>
      User.findOne({ nationalIdNumer: value }).then((user) => {
        if (user && user._id.toString() !== req.user._id.toString()) {
          return Promise.reject("SSN already exists");
        }
      })
    ),

  check("birthDate")
    .optional()
    .isDate()
    .withMessage("date of birth is invalid"),

  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),

  check("passwordConfirm").optional(),

  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers")
    .custom((value, { req }) =>
      User.findOne({ phoneNumber: value }).then((user) => {
        if (user && user._id.toString() !== req.user._id.toString()) {
          return Promise.reject("phone number already exists");
        }
      })
    ),

  check("governorate").optional(),
  check("street").optional(),
  check("city").optional(),
  check("buildingNumber").optional(),
  check("apartmentNumber").optional(),
  check("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("invalid gender"),

  check("profileImg").optional(),

  validatorMiddleware,
];
