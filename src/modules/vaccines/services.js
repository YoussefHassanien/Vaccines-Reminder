import { addNewVaccine, getAllVaccinesForParent } from "./repository.js";

/**
 * Creates a new vaccine in the database
 * @param {Object} vaccineData - Vaccine data to insert
 * @param {string} vaccineData.name - Vaccine name
 * @param {number} vaccineData.price - Vaccine price
 * @param {string} vaccineData.description - Vaccine description
 * @param {string} vaccineData.requiredAge - Vaccine required age
 * @param {string} vaccineData.provider - Provider ID
 * @returns {Object} Response with status code and message
 */
export const insertVaccine = async (vaccineData) => {
  try {
    const databaseVaccine = await addNewVaccine(vaccineData);
    return {
      statusCode: 201,
      message: "Vaccine is successfully created",
      data: databaseVaccine,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error inserting vaccine",
      error: error.message,
    };
  }
};

/**
 * Fetches all available vaccines for parents
 * @returns {Object} Response with status code and message
 */
export const fetchAllVaccinesForParent = async () => {
  try {
    const vaccines = await getAllVaccinesForParent();

    return {
      statusCode: 200,
      message: "Vaccines retrieved successfully",
      data: vaccines,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching vaccines",
      error: error.message,
    };
  }
};
