import { addNewComplaint, getAllComplaints } from "./repository.js";

/**
 * Creates a new complaint in the database
 * @param {Object} complaintData - Complaint data to insert
 * @returns {Object} Response with status code and message
 */
export const insertComplaint = async (complaintData) => {
  try {
    const databaseComplaint = await addNewComplaint(complaintData);
    return {
      statusCode: 201,
      message: "Complaint is successfully created",
      data: databaseComplaint,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error inserting complaint",
      error: error.message,
    };
  }
};

/**
 * Fetches all available complaints
 * @returns {Object} Response with status code and message
 */
export const fetchAllComplaints = async () => {
  try {
    const complaints = await getAllComplaints();

    if (!complaints || complaints.length === 0) {
      return {
        statusCode: 404,
        message: "No complaints found",
      };
    }

    return {
      statusCode: 200,
      message: "Complaints retrieved successfully",
      data: complaints,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching complaints",
      error: error.message,
    };
  }
};
