import { insertComplaint, fetchAllComplaints } from "./services.js";

/**
 * Creates a new complaint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createComplaint = async (req, res) => {
  const { message, type } = req.body;

  try {
    // Prepare complaint data
    const complaintData = {
      userId: req.user._id,
      message,
      type,
    };

    const {
      statusCode,
      message: responseMessage,
      data,
      error,
    } = await insertComplaint(complaintData);

    return res
      .status(statusCode)
      .json({ message: responseMessage, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error creating complaint",
      error: error.error,
    });
  }
};

/**
 * Retrieves all complaints
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveComplaints = async (req, res) => {
  try {
    const { statusCode, message, data, error } = await fetchAllComplaints();

    return res.status(statusCode).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error retrieving complaints",
      error: error.error,
    });
  }
};
