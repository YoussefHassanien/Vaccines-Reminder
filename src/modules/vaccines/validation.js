import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Provider from "../../models/providerModel.js";
import Vaccine from "../../models/vaccineModel.js";

/**
 * Validates vaccine creation request
 */
export const createVaccineValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name must be provided")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .bail()
    .trim()
    .escape(),

  body("description")
    .notEmpty()
    .withMessage("Description must be provided")
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters")
    .bail()
    .trim()
    .escape(),

  body("requiredAge")
    .notEmpty()
    .withMessage("Required age must be provided")
    .bail()
    .isIn([
      "No specific age required",
      "24 hours",
      "6 weeks",
      "10 weeks",
      "14 weeks",
      "2 months",
      "3 months",
      "4 months",
      "6 months",
      "8 months",
      "9 months",
      "1 year",
      "1 year and 3 months",
      "1 year and 6 months",
      "1 year and 9 months",
      "2 years",
      "2 years and 3 months",
      "2 years and 6 months",
      "2 years and 9 months",
      "3 years",
      "3 years and 3 months",
      "3 years and 6 months",
      "3 years and 9 months",
      "4 years",
      "9 years",
      "9 years and 3 months",
    ])
    .withMessage(
      "'{VALUE}' is not a valid age requirement. Please choose from the predefined age options."
    )
    .bail()
    .escape(),

  body("price")
    .notEmpty()
    .withMessage("Price must be provided")
    .bail()
    .isNumeric()
    .withMessage("Price must be a number")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price can't be negative"),

  body("provider")
    .notEmpty()
    .withMessage("Provider must be provided")
    .bail()
    .isMongoId()
    .withMessage("Invalid provider ID format")
    .bail()
    .custom(async (providerId) => {
      // Check if provider exists
      const provider = await Provider.findById(providerId);

      if (!provider) {
        throw new Error("Provider not found");
      }

      return true;
    }),

  validatorMiddleware,
];

import { param } from "express-validator";

/**
 * Validates vaccine deletion request
 */
export const deleteVaccineValidator = [
  param("vaccineId")
    .notEmpty()
    .withMessage("Vaccine ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid vaccine ID format")
    .bail()
    .custom(async (vaccineId) => {
      // Check if vaccine exists
      const vaccine = await Vaccine.findById(vaccineId);

      if (!vaccine) {
        throw new Error("Vaccine not found");
      }

      return true;
    }),

  validatorMiddleware,
];
