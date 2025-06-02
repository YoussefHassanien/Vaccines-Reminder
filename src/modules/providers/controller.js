import {
  insertNewProvider,
  fetchAllProviders,
  fetchProviderById,
} from "./sevices.js";

export const addProvider = async (req, res) => {
  try {
    const providerData = req.body;

    const { status, message, data, error } = await insertNewProvider(
      providerData
    );
    return res.status(status).json({
      message,
      data,
      error,
    });
  } catch {
    return res.status(500).json({
      message: "Error inserting provider",
      error: error.message,
    });
  }
};

export const getAllProviders = async (req, res) => {
  try {
    const { status, message, data, error } = await fetchAllProviders();
    return res.status(status).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching providers",
      error: error.message,
    });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, data, error } = await fetchProviderById(id);
    return res.status(status).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching provider",
      error: error.message,
    });
  }
};
