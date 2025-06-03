import {
  insertVaccineRequest,
  fetchAllVaccinesRequests,
  fetchUserVaccineRequests,
  deleteUserVaccineRequest,
  changeNurseSlotIsBooked,
} from "./services.js";

/**
 * Creates a new vaccine request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createVaccineRequest = async (req, res) => {
  const {
    childId,
    vaccineId,
    vaccinationDate,
    governorate,
    phoneNumber,
    city,
    street,
    buildingNumber,
    apartmentNumber,
  } = req.body;

  try {
    // Validate and parse numeric values to avoid type errors
    const vaccineRequestData = {
      parentId: req.user._id,
      childId,
      vaccineId,
      vaccinationDate: new Date(vaccinationDate),
      governorate,
      phoneNumber,
      city,
      street,
      buildingNumber: parseInt(buildingNumber, 10),
      apartmentNumber: parseInt(apartmentNumber, 10),
    };

    const { statusCode, message, data, error } = await insertVaccineRequest(
      vaccineRequestData
    );

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error creating vaccine request",
      error: error.error,
    });
  }
};

/**
 * Retrieves all vaccine requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveVaccineRequests = async (req, res) => {
  try {
    const { statusCode, message, data, error } =
      await fetchAllVaccinesRequests();

    return res.status(statusCode).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error retrieving vaccine requests",
      error: error.error,
    });
  }
};

export const retrieveUserVaccineRequests = async (req, res) => {
  const user = req.user;

  try {
    const { statusCode, message, data } = await fetchUserVaccineRequests(
      user._id
    );
    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const cancelUserVaccineRequest = async (req, res) => {
  const vaccineRequest = req.vaccineRequest;

  try {
    if (vaccineRequest.status === "Confirmed") {
      await changeNurseSlotIsBooked(vaccineRequest.nurseSlotId);
    }

    const { statusCode, message, data } = await deleteUserVaccineRequest(
      vaccineRequest._id
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};
