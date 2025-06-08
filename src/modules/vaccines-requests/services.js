import {
  addNewVaccineRequest,
  getAllVaccineRequests,
  getUserVaccineRequests,
  removeUserVaccineRequest,
  updateNurseSlotIsBooked,
  updateVaccineRequestStatus,
  addCertificateToVaccineRequest,
  getVaccineCertificate,
} from "./repository.js";
import cloudinary from "../../../config/cloudinary.js";
import { Readable } from "stream";
import path from "path";

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {String} filename - Original filename
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Vaccines-Reminder/certificates",
        public_id: `${Date.now()}-${path.basename(
          filename,
          path.extname(filename)
        )}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    readableStream.pipe(uploadStream);
  });
};

export const getImageCloudinaryUrl = (publicId) => {
  if (!publicId) return false;
  try {
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl;
  } catch (error) {
    console.log("Error getting the image url", error);
    return null;
  }
};

/**
 * Creates a new vaccine request in the database
 * @param {Object} vaccineRequestData - Vaccine data to insert
 * @returns {Object} Response with status code and message
 */
export const insertVaccineRequest = async (vaccineRequestData) => {
  try {
    const databaseVaccineRequest = await addNewVaccineRequest(
      vaccineRequestData
    );
    return {
      statusCode: 201,
      message: "Vaccine Request is successfully created",
      data: databaseVaccineRequest,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error inserting vaccine request",
      error: error.message,
    };
  }
};

/**
 * Fetches all available vaccine requests
 * @returns {Object} Response with status code and message
 */
export const fetchAllVaccinesRequests = async () => {
  try {
    const vaccineRequests = await getAllVaccineRequests();

    return {
      statusCode: 200,
      message: "Vaccine Requests retrieved successfully",
      data: vaccineRequests,
    };
  } catch (error) {
    if (error.message.include("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error fetching vaccine requests",
      error: error.message,
    };
  }
};

export const fetchUserVaccineRequests = async (userId) => {
  try {
    const vaccineRequests = await getUserVaccineRequests(userId);

    return {
      statusCode: 200,
      message: "Vaccine requests retrieved successfully",
      data: vaccineRequests,
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error fetching user vaccine requests",
      error: error.message,
    };
  }
};

export const deleteUserVaccineRequest = async (vaccineRequestId) => {
  try {
    const vaccineRequest = await removeUserVaccineRequest(vaccineRequestId);

    return {
      statusCode: 200,
      message: "Vaccine request is canceled successfully",
      data: {
        canceledVaccineRequest: vaccineRequest,
      },
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error canceling vaccine request",
      error: error.message,
    };
  }
};

export const changeNurseSlotIsBooked = async (nurseSlotId) => {
  try {
    await updateNurseSlotIsBooked(nurseSlotId);
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }

    throw {
      statusCode: 500,
      message: "Error changing nurse slot isBooked!",
      error: error.message,
    };
  }
};

export const changeVaccineRequestStatus = async (vaccineRequestId, status) => {
  try {
    const vaccineRequest = await updateVaccineRequestStatus(
      vaccineRequestId,
      status
    );

    return {
      statusCode: 200,
      message: "Vaccine request status is updated successfully",
      data: vaccineRequest,
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error updating vaccine request status",
      error: error.message,
    };
  }
};
export const addCertificateToVaccineRequestService = async (
  vaccineRequestId,
  certificateUrl
) => {
  try {
    const updatedVaccineRequest = await addCertificateToVaccineRequest(
      vaccineRequestId,
      certificateUrl
    );

    return {
      statusCode: 200,
      message: "Certificate added to vaccine request successfully",
      data: updatedVaccineRequest,
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error adding certificate to vaccine request",
      error: error.message,
    };
  }
};

export const getVaccineCertificateService = async (vaccineRequestId) => {
  try {
    const certificate = await getVaccineCertificate(vaccineRequestId);
    return {
      statusCode: 200,
      message: "Vaccine certificate retrieved successfully",
      data: certificate.data,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw {
      statusCode: 500,
      message: "Error retrieving vaccine certificate",
      error: error.message,
    };
  }
};

