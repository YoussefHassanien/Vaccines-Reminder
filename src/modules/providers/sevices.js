import { addNewProvider } from "./repository.js";

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
