import VaccineRequest from "../../models/vaccineRequestModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

/**
 * Create and save a new vaccine request in the database
 * @param {Object} vaccineRequestData - vaccine request information
 * @returns {Promise<Object>} Created vaccine request document
 */
export const addNewVaccineRequest = async (vaccineRequestData) => {
  try {
    const vaccineRequest = new VaccineRequest(vaccineRequestData);
    const savedVaccineRequest = await vaccineRequest.save();

    // Convert to plain object and remove unwanted fields
    const formattedVaccineRequest = formatMongoDbObjects(savedVaccineRequest);

    return formattedVaccineRequest;
  } catch (error) {
    console.error("Error inserting vaccine request:", error);
    throw error;
  }
};

/**
 * Get all vaccines requests from the database
 * @returns {Promise<Object>} vaccine requests array
 */
export const getAllVaccineRequests = async () => {
  try {
    const vaccineRequests = await VaccineRequest.find();

    return vaccineRequests;
  } catch (error) {
    console.error("Error fetching vaccine requests", error);
    throw error;
  }
};
