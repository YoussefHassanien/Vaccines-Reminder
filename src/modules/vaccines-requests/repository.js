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

export const getUserVaccineRequests = async (userId) => {
  try {
    const vaccineRequests = await VaccineRequest.find({ parentId: userId })
      .select(
        "status vaccinationDate governorate city street nurseId vaccineId"
      )
      .populate({
        path: "vaccineId",
        select: "name",
      })
      .populate({
        path: "nurseId",
        select: "hospitalName fName lName",
        model: "Nurse",
      });

    if (!vaccineRequests || vaccineRequests.length === 0) {
      throw new Error(`Vaccine requests for user with id: ${userId} not found`);
    }

    const formattedVaccineRequests = vaccineRequests.map((vr) => {
      const vrObject = vr.toObject();

      return {
        _id: vrObject._id,
        status: vrObject.status,
        vaccinationDate: vrObject.vaccinationDate,
        governorate: vrObject.governorate,
        city: vrObject.city,
        street: vrObject.street,
        vaccine: vrObject.vaccineId,
        nurse: vrObject.nurseId,
      };
    });

    return formattedVaccineRequests;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
