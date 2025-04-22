import Provider from "../../models/providerModel.js";

/**
 * Create and save a new provider in the database
 * @param {Object} providerData - provider information
 * @param {string} providerData.name - provider name
 * @param {number} providerData.phone - provider phone
 * @param {string} providerData.city - provider city
 * @param {string} providerData.governorate - provider governorate
 * @param {number} providerData.district - provider district
 * @param {number} providerData.workHours - provider workHours
 * @returns {Promise<Object>} Created provider document
 */
export const addNewProvider = async (providerData) => {
  try {
    const provider = new Provider(providerData);
    const savedProvider = await provider.save();

    // Convert to plain object and remove unwanted fields
    const providerObj = savedProvider.toObject();
    delete providerObj.createdAt;
    delete providerObj.updatedAt;
    delete providerObj.__v;

    return providerObj;
  } catch (error) {
    console.error("Error inserting provider:", error);
    throw error;
  }
};
