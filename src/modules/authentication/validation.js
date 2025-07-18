// validation layer functions
import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";

export const signupValidator = [
  check("fName")
    .notEmpty()
    .withMessage("First name must be specified")
    .isLength({ min: 3 })
    .withMessage("First name is too short")
    .isLength({ max: 15 })
    .withMessage("First name is too long")
    .custom((value, { req }) => {
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
      return true;
    }),

  check("lName")
    .notEmpty()
    .withMessage("Last name must be specified")
    .isLength({ min: 3 })
    .withMessage("Last name is too short")
    .isLength({ max: 15 })
    .withMessage("Last name is too long"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already in use");
        }
      })
    ),
  check("birthDate")
    .notEmpty()
    .withMessage("date of birth is required")
    .isDate()
    .withMessage("date of birth is invalid"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Confirm password is required"),

  check("phoneNumber")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers")
    .custom((value) =>
      User.findOne({ phoneNumber: value }).then((user) => {
        if (user) {
          return Promise.reject("phone number already exists");
        }
      })
    ),

  check("governorate").notEmpty().withMessage("gov must have a value"),
  check("street").notEmpty().withMessage("street must have a value"),
  check("city").notEmpty().withMessage("city must have a value"),
  check("buildingNumber")
    .notEmpty()
    .withMessage("buildingNumber must have a value"),
  check("apartmentNumber")
    .notEmpty()
    .withMessage("apartmentNumber must have a value"),
  check("gender")
    .notEmpty()
    .withMessage("gender must be specified")
    .isIn(["male", "female"])
    .withMessage("invalid gender"),
  check("profileImg").optional(),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject("Email not found");
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validatorMiddleware,
];

export const updatePasswordValidator = [
  check("oldPassword")
    .notEmpty()
    .withMessage("old password is required")
    .isLength({ min: 6 })
    .withMessage("old password must be at least 6 characters"),
  check("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("new password must be at least 6 characters"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  validatorMiddleware,
];

export const forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("No user found with this email");
      }
      return true;
    }),
  validatorMiddleware,
];

export const verifyOTPValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  validatorMiddleware,
];

export const resetPasswordValidator = [
  check("resetToken")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 20 })
    .withMessage("Reset token is invalid"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  validatorMiddleware,
];

