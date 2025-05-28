import Complaint from "../../models/complaintModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

/**
 * Create and save a new complaint in the database
 * @param {Object} complaintData - complaint information
 * @returns {Promise<Object>} Created complaint document
 */
export const addNewComplaint = async (complaintData) => {
  try {
    const complaint = new Complaint(complaintData);
    const savedComplaint = await complaint.save();

    // Convert to plain object and remove unwanted fields
    const formattedComplaint = formatMongoDbObjects(savedComplaint);

    return formattedComplaint;
  } catch (error) {
    console.error("Error inserting complaint:", error);
    throw error;
  }
};

/**
 * Get all complaints from the database
 * @returns {Promise<Object>} complaints array
 */
export const getAllComplaints = async () => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "userId",
        select: "fName lName email phoneNumber",
      })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    return complaints;
  } catch (error) {
    console.error("Error fetching complaints", error);
    throw error;
  }
};
