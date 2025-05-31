import {
  addNewVaccineRequest,
  getAllVaccineRequests,
  getUserVaccineRequests,
} from "./repository.js";

/**
 * Creates a new vaccine request in the database
 * @param {Object} vaccineRequestData - Vaccine data to insert
 * @returns {Object} Response with status code and message
 */
export const insertVaccineRequest = async (vaccineRequestData) => {
  try {
    const databaseVaccineRequest = await addNewVaccineRequest(
      vaccineRequestData
    );
    return {
      statusCode: 201,
      message: "Vaccine Request is successfully created",
      data: databaseVaccineRequest,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error inserting vaccine request",
      error: error.message,
    };
  }
};

/**
 * Fetches all available vaccine requests
 * @returns {Object} Response with status code and message
 */
export const fetchAllVaccinesRequests = async () => {
  try {
    const vaccineRequests = await getAllVaccineRequests();

    return {
      statusCode: 200,
      message: "Vaccine Requests retrieved successfully",
      data: vaccineRequests,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching vaccine requests",
      error: error.message,
    };
  }
};

export const fetchUserVaccineRequests = async (userId) => {
  try {
    const vaccineRequests = await getUserVaccineRequests(userId);

    return {
      statusCode: 200,
      message: "Vaccine requests retrieved successfully",
      data: vaccineRequests,
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error fetching user vaccine requests",
      error: error.message,
    };
  }
};
