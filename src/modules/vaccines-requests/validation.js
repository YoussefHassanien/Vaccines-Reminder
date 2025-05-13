import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";
import Child from "../../models/childModel.js";
import Vaccine from "../../models/vaccineModel.js";

/**
 * Validates vaccine request creation
 */
export const createVaccineRequestValidator = [
  body("childId")
    .notEmpty()
    .withMessage("Child ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid child ID format")
    .bail()
    .custom(async (childId, { req }) => {
      // Check if child exists
      const child = await Child.findById(childId);

      if (!child) {
        throw new Error("Child not found");
      }

      // Get authenticated user from request object (set by authentication middleware)
      const authenticatedUserId = req.user._id.toString();

      // Check if this child belongs to the authenticated user
      if (child.userId.toString() !== authenticatedUserId) {
        throw new Error("Child does not belong to you");
      }

      return true;
    }),

  body("vaccineId")
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

  body("vaccinationDate")
    .notEmpty()
    .withMessage("Vaccination date is required")
    .bail()
    .isISO8601()
    .withMessage("Vaccination date must be a valid date")
    .bail()
    .custom((value) => {
      // Check if date is not in the past
      const vaccinationDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (vaccinationDate < today) {
        throw new Error("Vaccination date cannot be in the past");
      }

      return true;
    }),

  body("governorate")
    .notEmpty()
    .withMessage("Governorate is required")
    .bail()
    .isLength({ min: 4, max: 30 })
    .withMessage("Governorate must be between 4 and 30 characters")
    .bail()
    .trim()
    .escape(),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .bail()
    .isLength({ min: 4, max: 50 })
    .withMessage("City must be between 4 and 50 characters")
    .bail()
    .trim()
    .escape(),

  body("street")
    .notEmpty()
    .withMessage("Street is required")
    .bail()
    .isLength({ min: 4, max: 100 })
    .withMessage("Street must be between 4 and 100 characters")
    .bail()
    .trim()
    .escape(),

  body("buildingNumber")
    .notEmpty()
    .withMessage("Building number is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer"),

  body("apartmentNumber")
    .notEmpty()
    .withMessage("Apartment number is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Apartment number must be a positive integer"),

  validatorMiddleware,
];
