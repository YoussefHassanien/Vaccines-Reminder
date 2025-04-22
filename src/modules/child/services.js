import cloudinary from "../../../config/cloudinary.js";
import {
  addNewChild,
  getPaginatedChildren,
  deleteChild,
  getChildrenByUserId,
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
        folder: "Vaccines-Reminder/Children/certificates",
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

export const addNewChildService = async (childData) => {
  try {
    const child = await addNewChild(childData);
    if (!child) {
      return {
        status: 500,
        message: "Error inserting child",
      };
    }
    return {
      status: 201,
      message: "Child is successfully created",
      data: child,
    };
  } catch (error) {
    console.error("Error adding new child:", error);
    throw error;
  }
};

export const fetchPaginatedChildrenService = async (cursor, limit) => {
  try {
    const children = await getPaginatedChildren(cursor, limit);
    if (!children) {
      return {
        status: 500,
        message: "Error getting all children",
      };
    }
    return {
      status: 200,
      message: "Children are successfully retrieved",
      data: children,
    };
  } catch (error) {
    console.error("Error fetching paginated children:", error);
    throw error;
  }
};

export const getChildrenByUser = async (userId) => {
  try {
    const children = await getChildrenByUserId(userId);
    if (!children) {
      return {
        status: 500,
        message: "current user has no children",
      };
    }
    return {
      status: 200,
      message: "Children are successfully retrieved",
      data: children,
    };
  } catch (error) {
    console.error("Error fetching paginated children:", error);
    throw error;
  }
};

export const deleteChildService = async (id) => {
  try {
    const child = await deleteChild(id);
    if (!child) {
      return {
        status: 500,
        message: "Error deleting child",
      };
    }
    return {
      status: 200,
      message: "Child is successfully deleted",
      data: child,
    };
  } catch (error) {
    console.error("Error deleting child:", error);
    throw error;
  }
};
