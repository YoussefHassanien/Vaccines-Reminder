import {
  insertVaccine,
  fetchAllVaccinesForParent,
  deleteVaccine,
} from "./services.js";

/**
 * Creates a new vaccine
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createVaccine = async (req, res) => {
  const { name, description, price, requiredAge, provider } = req.body;

  try {
    // Validate and parse numeric values to avoid type errors
    const vaccineData = {
      name,
      description,
      requiredAge,
      price: parseFloat(price),
      provider,
    };

    const { statusCode, message, data, error } = await insertVaccine(
      vaccineData
    );

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error creating vaccine",
      error: error.error,
    });
  }
};

/**
 * Retrieves all vaccines for parent view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveVaccinesForParent = async (req, res) => {
  try {
    const { statusCode, message, data, error } =
      await fetchAllVaccinesForParent();

    return res.status(statusCode).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error retrieving vaccines",
      error: error.error,
    });
  }
};

/**
 * Deletes a vaccine
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const eraseVaccine = async (req, res) => {
  const { vaccineId } = req.params;

  try {
    const { statusCode, message, data, error } = await deleteVaccine(vaccineId);

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error deleting vaccine",
      error: error.error,
    });
  }
};
