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

/**
 * Get all providers from the database
 * @returns {Promise<Array>} List of all providers
 */
export const getAllProviders = async () => {
  try {
    const providers = await Provider.find().lean();
    return providers.map((provider) => {
      delete provider.createdAt;
      delete provider.updatedAt;
      delete provider.__v;
      return provider;
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }
};
/**
 * Get a provider by its ID
 * @param {string} id - Provider ID
 * @returns {Promise<Object>} Provider document
 */
export const getProviderById = async (id) => {
  try {
    const provider = await Provider.findById(id).lean();
    if (!provider) {
      throw new Error("Provider not found");
    }
    delete provider.createdAt;
    delete provider.updatedAt;
    delete provider.__v;
    return provider;
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    throw error;
  }
};


/**
 * Update a provider by its ID
 * @param {string} id - Provider ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated provider document
 */

export const updateProviderById = async (id, updateData) => {
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedProvider) {
      throw new Error("Provider not found");
    }
    delete updatedProvider.createdAt;
    delete updatedProvider.updatedAt;
    delete updatedProvider.__v;
    return updatedProvider;
  } catch (error) {
    console.error("Error updating provider:", error);
    throw error;
  }
};

/**
 * Delete a provider by its ID
 * @param {string} id - Provider ID
 * @returns {Promise<Object>} Deleted provider document
 */
export const deleteProviderById = async (id) => {
  try {
    const deletedProvider = await Provider.findByIdAndDelete(id).lean();
    if (!deletedProvider) {
      throw new Error("Provider not found");
    }
    delete deletedProvider.createdAt;
    delete deletedProvider.updatedAt;
    delete deletedProvider.__v;
    return deletedProvider;
  } catch (error) {
    console.error("Error deleting provider:", error);
    throw error;
  }
};

