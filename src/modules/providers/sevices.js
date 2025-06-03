import {
  addNewProvider,
  getAllProviders,
  getProviderById,
  updateProviderById,
  deleteProviderById,
} from "./repository.js";

export const insertNewProvider = async (providerData) => {
  try {
    const newProvider = await addNewProvider(providerData);
    if (!newProvider) {
      return {
        status: 500,
        message: "Error inserting provider",
      };
    }
    return {
      status: 201,
      message: "provider is successfully created",
      data: newProvider,
    };
  } catch (error) {
    return {
      status: 500, // <-- add this for consistency
      message: "Error inserting provider",
      error: error.message,
    };
  }
};

export const fetchAllProviders = async () => {
  try {
    const providers = await getAllProviders();
    return {
      status: 200,
      message: "Providers fetched successfully",
      data: providers,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching providers",
      error: error.message,
    };
  }
};
export const fetchProviderById = async (id) => {
  try {
    const provider = await getProviderById(id);
    return {
      status: 200,
      message: "Provider fetched successfully",
      data: provider,
    };
  } catch (error) {
    return {
      status: 404,
      message: "Provider not found",
      error: error.message,
    };
  }
};
export const modifyProviderById = async (id, providerData) => {
  try {
    const updatedProvider = await updateProviderById(id, providerData);
    if (!updatedProvider) {
      return {
        status: 404,
        message: "Provider not found",
      };
    }
    return {
      status: 200,
      message: "Provider updated successfully",
      data: updatedProvider,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error updating provider",
      error: error.message,
    };
  }
};
export const removeProviderById = async (id) => {
  try {
    const deletedProvider = await deleteProviderById(id);
    if (!deletedProvider) {
      return {
        status: 404,
        message: "Provider not found",
      };
    }
    return {
      status: 200,
      message: "Provider deleted successfully",
      data: deletedProvider,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error deleting provider",
      error: error.message,
    };
  }
};

