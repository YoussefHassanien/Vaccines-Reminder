import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Provider from "../../models/providerModel.js";

export const addNewProviderValidator = [
  check("name")
    .notEmpty()
    .withMessage("Provider name required")
    .isLength({ min: 2 })
    .withMessage("Provider name must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Provider name must be at most 100 characters")
    .custom(async (value, { req }) => {
      const slug = slugify(value, { lower: true });
      await Provider.findOne({ slug: slug }).then((provider) => {
        if (provider) {
          return Promise.reject("Provider already exists");
        }
      });
      req.body.slug = slug;
      return true;
    }),
  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers")
    .custom((value) =>
      Provider.findOne({ phone: value }).then((provider) => {
        if (provider) {
          return Promise.reject("phone number already exists");
        }
      })
    ),
  check("city").notEmpty().withMessage("city must have a value"),
  check("governorate").notEmpty().withMessage("gov must have a value"),
  check("district").notEmpty().withMessage("district must have a value"),
  check("workHours")
    .notEmpty()
    .withMessage("work hours must have a value")
    .isLength({ min: 2 })
    .withMessage("work hours must be at least 2 characters")
    .isLength({ max: 20 })
    .withMessage("work hours must be at most 10 characters"),
  ,
  validatorMiddleware,
];

export const updateProviderValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Provider name required")
    .isLength({ min: 2 })
    .withMessage("Provider name must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Provider name must be at most 100 characters")
    .custom(async (value, { req }) => {
      const slug = slugify(value, { lower: true });
      await Provider.findOne({ slug: slug }).then((provider) => {
        if (provider) {
          return Promise.reject("Provider already exists");
        }
      });
      req.body.slug = slug;
      return true;
    }),
  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers")
    .custom((value) =>
      Provider.findOne({ phone: value }).then((provider) => {
        if (provider) {
          return Promise.reject("phone number already exists");
        }
      })
    ),
  check("city").optional().notEmpty().withMessage("city must have a value"),
  check("governorate")
    .optional()
    .notEmpty()
    .withMessage("gov must have a value"),
  check("district")
    .optional()
    .notEmpty()
    .withMessage("district must have a value"),
  check("workHours")
    .optional()
    .notEmpty()
    .withMessage("work hours must have a value")
    .isLength({ min: 2 })
    .withMessage("work hours must be at least 2 characters")
    .isLength({ max: 20 })
    .withMessage("work hours must be at most 10 characters"),
  ,
  validatorMiddleware,
];

export const findProviderByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid provider id format")
    .custom(async (value) => {
      const provider = await Provider.findById(value);
      if (!provider) {
        return Promise.reject("Provider not found");
      }
      return true;
    }),
  validatorMiddleware,
];
