import {
  addNewVaccineRequest,
  getAllVaccineRequests,
  getUserVaccineRequests,
  removeUserVaccineRequest,
  updateNurseSlotIsBooked,
  updateVaccineRequestStatus,
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
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
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

export const deleteUserVaccineRequest = async (vaccineRequestId) => {
  try {
    const vaccineRequest = await removeUserVaccineRequest(vaccineRequestId);

    return {
      statusCode: 200,
      message: "Vaccine request is canceled successfully",
      data: {
        canceledVaccineRequest: vaccineRequest,
      },
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
      message: "Error canceling vaccine request",
      error: error.message,
    };
  }
};

export const changeNurseSlotIsBooked = async (nurseSlotId) => {
  try {
    await updateNurseSlotIsBooked(nurseSlotId);
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }

    throw {
      statusCode: 500,
      message: "Error changing nurse slot isBooked!",
      error: error.message,
    };
  }
};

export const changeVaccineRequestStatus = async (vaccineRequestId, status) => {
  try {
    const vaccineRequest = await updateVaccineRequestStatus(
      vaccineRequestId,
      status
    );

    return {
      statusCode: 200,
      message: "Vaccine request status is updated successfully",
      data: vaccineRequest,
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
      message: "Error updating vaccine request status",
      error: error.message,
    };
  }
};
