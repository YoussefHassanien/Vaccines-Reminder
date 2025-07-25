import Vaccine from "../../models/vaccineModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

/**
 * Create and save a new vaccine in the database
 * @param {Object} vaccineData - vaccine information
 * @param {string} vaccineData.name - vaccine name
 * @param {number} vaccineData.price - vaccine price
 * @param {string} vaccineData.description - vaccine description
 * @param {string} vaccineData.requiredAge - vaccine required age
 * @returns {Promise<Object>} Created vaccine document
 */
export const addNewVaccine = async (vaccineData) => {
  try {
    const vaccine = new Vaccine(vaccineData);
    const savedVaccine = await vaccine.save();

    // Convert to plain object and remove unwanted fields
    const formattedVaccine = formatMongoDbObjects(savedVaccine);

    return formattedVaccine;
  } catch (error) {
    console.error("Error inserting vaccine:", error);
    throw error;
  }
};

/**
 * Get all vaccines from the database
 * @returns {Promise<Object>} vaccines array
 */
export const getAllVaccinesForParent = async () => {
  try {
    const vaccines = await Vaccine.find().select(
      "-createdAt -updatedAt -__v -provider"
    );

    return vaccines;
  } catch (error) {
    console.error("Error fetching vaccines for parent", error);
    throw error;
  }
};

/**
 * Delete a vaccine from the database
 * @param {String} vaccineId - MongoDB ObjectId of the vaccine
 * @returns {Promise<Object>} Deleted vaccine document
 */
export const removeVaccine = async (vaccineId) => {
  try {
    const deletedVaccine = await Vaccine.findByIdAndDelete(vaccineId);

    if (!deletedVaccine) {
      throw new Error(`Vaccine with id: ${vaccineId} not found`);
    }

    return formatMongoDbObjects(deletedVaccine);
  } catch (error) {
    console.error(`Error deleting vaccine with id: ${vaccineId}`, error);
    throw error;
  }
};
