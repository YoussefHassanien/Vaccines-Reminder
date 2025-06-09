import cloudinary from "../../../config/cloudinary.js";
import {
  addNewNurse,
  getNurseSlots,
  bookSlot,
  cancelSlot,
  getFreeSlots,
  getPaginatedNurses,
  deleteNurse,
} from "./repository.js";
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
        folder: "Vaccines-Reminder/nurse",
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

export const createNewNurseService = async (nurseData) => {
  try {
    const newNurse = await addNewNurse(nurseData);
    if (!newNurse) {
      return {
        status: 500,
        message: "Error creating nurse",
      };
    }
    return {
      status: 201,
      message: "Nurse is successfully created",
      data: newNurse,
    };
  } catch (error) {
    return {
      message: "Error creating nurse",
      error: error.message,
    };
  }
};

export const fetchPaginatedNurse = async (cursor, limit) => {
  try {
    const nurses = await getPaginatedNurses(cursor, limit);
    if (!nurses) {
      return {
        status: 500,
        message: "Error getting all nurses",
      };
    }
    return {
      status: 200,
      message: "Nurses are successfully retrieved",
      data: nurses,
    };
  } catch (error) {
    return {
      message: "Error getting all nurses",
      error: error.message,
    };
  }
};

export const getNurseSlotsService = async (nurseId) => {
  try {
    const slots = await getNurseSlots(nurseId);
    if (!slots) {
      return {
        status: 404,
        message: `No slots found for nurse with ID: ${nurseId}`,
      };
    }
    return {
      status: 200,
      message: "Nurse slots retrieved successfully",
      data: slots,
    };
  } catch (error) {
    return {
      message: `Error retrieving slots for nurse with ID ${nurseId}`,
      error: error.message,
    };
  }
};

export const bookNurseSlot = async (slotId, vaccineId, nurseId) => {
  try {
    const slot = await bookSlot(slotId, vaccineId, nurseId);
    if (!slot) {
      return {
        status: 404,
        message: `No slot found with ID: ${slotId} for nurse with ID: ${nurseId}`,
      };
    }
    return {
      status: 200,
      message: "Slot booked successfully",
      data: slot,
    };
  } catch (error) {
    return {
      message: `Error booking slot for nurse with ID ${nurseId}`,
      error: error.message,
    };
  }
};

export const cancelNurseSlot = async (nurseId, slotId) => {
  try {
    const slot = await cancelSlot(nurseId, slotId);
    if (!slot) {
      return {
        status: 404,
        message: `No slot found with ID: ${slotId} for nurse with ID: ${nurseId}`,
      };
    }
    return {
      status: 200,
      message: "Slot cancelled successfully",
      data: slot,
    };
  } catch (error) {
    return {
      message: `Error cancelling slot for nurse with ID ${nurseId}`,
      error: error.message,
    };
  }
};

export const deleteNurseById = async (id) => {
  try {
    const result = await deleteNurse(id);
    if (!result || !result.nurse) {
      return {
        status: 404,
        message: `Could not find the nurse with ID: ${id}`,
      };
    }
    return {
      status: 200,
      message: `Nurse with ID ${id} is deleted successfully. ${result.deletedSlotsCount} associated slots were also removed.`,
      data: result.nurse,
    };
  } catch (error) {
    return {
      status: 500,
      message: `Error deleting nurse with ID ${id}`,
      error: error.message,
    };
  }
};

export const getFreeNurseSlots = async (nurseId) => {
  try {
    const slots = await getFreeSlots(nurseId);
    console.log("Free slots:", slots);
    if (!slots) {
      return {
        status: 404,
        message: `No free slots found for nurse with ID: ${nurseId}`,
      };
    }
    return {
      status: 200,
      message: "Free nurse slots retrieved successfully",
      data: slots,
    };
  } catch (error) {
    return {
      message: `Error retrieving free slots for nurse with ID ${nurseId}`,
      error: error.message,
    };
  }
};
