import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Child from "../../models/childModel.js";
import Vaccine from "../../models/vaccineModel.js";
import VaccineRequest from "../../models/vaccineRequestModel.js";

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

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .trim()
    .isMobilePhone(["ar-EG", "ar-SA"]) // For Egyptian and Saudi numbers
    .withMessage(
      "Invalid phone number format, only EG and SA phone numbers are accepted"
    )
    .bail()
    .escape(),

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

export const cancelUserVaccineRequestValidator = [
  param("vaccineRequestId")
    .notEmpty()
    .withMessage("Vaccine request id is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid vaccine request id format")
    .bail()
    .custom(async (vaccineRequestId, { req }) => {
      const vaccineRequest = await VaccineRequest.findOne({
        _id: vaccineRequestId,
        parentId: req.user._id,
        status: { $in: ["Pending", "Confirmed"] },
      });

      if (!vaccineRequest) {
        throw new Error(
          `Vaccine request of id: ${vaccineRequestId} and partent id: ${req.user._id} not found!`
        );
      }

      if (vaccineRequest.status === "Confirmed") {
        const now = new Date();
        const vaccinationDate = new Date(vaccineRequest.vaccinationDate);

        // Calculate the difference in milliseconds
        const timeDifference = vaccinationDate.getTime() - now.getTime();

        // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
        const daysDifference = timeDifference / (24 * 60 * 60 * 1000);

        // Check if the vaccination date is less than 2 days ahead
        if (daysDifference < 2) {
          throw new Error(
            "Vaccine request can be canceled only 2 days before its date"
          );
        }
      }

      // Store the vaccine request in req object for use in controller
      req.vaccineRequest = vaccineRequest;

      return true;
    }),

  validatorMiddleware,
];

export const modifyVaccineRequestStatusValidator = [
  param("vaccineRequestId")
    .notEmpty()
    .withMessage("Vaccine request id is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid vaccine request id format"),

  body("status")
    .notEmpty()
    .withMessage("Vaccine request status is required")
    .bail()
    .isIn(["Pending", "Confirmed", "Rejected", "Delivered"])
    .withMessage(
      "Vaccine request status value is not valid, Status can only be Pending, Confirmed, Rejected, and Delivered"
    )
    .bail()
    .escape(),

  validatorMiddleware,
];
