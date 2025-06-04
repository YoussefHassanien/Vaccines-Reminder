import {
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getAllTrimesters,
  getTrimesterById,
  updateTrimester,
  deleteTrimester,
  createTrimester,
  getAllPregnancyTips,
  getPregnancyTipById,
  createPregnancyTip,
  updatePregnancyTip,
  deletePregnancyTip,
  getAllRecommendedFoods,
  getRecommendedFoodById,
  createRecommendedFood,
  updateRecommendedFood,
  deleteRecommendedFood,
} from "./repository.js";
import cloudinary from "../../../config/cloudinary.js";
import path from "path";
import { Readable } from "stream";

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
        folder: "Vaccines-Reminder/Products",
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

export const getAllTipsData = async () => {
  try {
    const milestones = await getAllMilestones();
    const trimesters = await getAllTrimesters();
    const pregnancyTips = await getAllPregnancyTips();
    const recommendedFoods = await getAllRecommendedFoods();

    return {
      milestones,
      trimesters,
      pregnancyTips,
      recommendedFoods,
    };
  } catch (error) {
    console.error("Error fetching all tips data:", error);
    throw error;
  }
};

export const createMilestoneService = async (milestoneData) => {
  try {
    const newMilestone = await createMilestone(milestoneData);
    return newMilestone;
  } catch (error) {
    console.error("Error creating milestone:", error);
    throw error;
  }
};

export const createTrimesterService = async (trimesterData) => {
  try {
    const newTrimester = await createTrimester(trimesterData);
    return newTrimester;
  } catch (error) {
    console.error("Error creating trimester:", error);
    throw error;
  }
};

export const createPregnancyTipService = async (tipData) => {
  try {
    const newTip = await createPregnancyTip(tipData);
    return newTip;
  } catch (error) {
    console.error("Error creating pregnancy tip:", error);
    throw error;
  }
};
export const createRecommendedFoodService = async (foodData) => {
  try {
    const newFood = await createRecommendedFood(foodData);
    return newFood;
  } catch (error) {
    console.error("Error creating recommended food:", error);
    throw error;
  }
};

export const deleteMilestoneService = async (id) => {
  try {
    const deletedMilestone = await deleteMilestone(id);
    return deletedMilestone;
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw error;
  }
};
export const deleteTrimesterService = async (id) => {
  try {
    const deletedTrimester = await deleteTrimester(id);
    return deletedTrimester;
  } catch (error) {
    console.error("Error deleting trimester:", error);
    throw error;
  }
};
export const deletePregnancyTipService = async (id) => {
  try {
    const deletedTip = await deletePregnancyTip(id);
    return deletedTip;
  } catch (error) {
    console.error("Error deleting pregnancy tip:", error);
    throw error;
  }
};
export const deleteRecommendedFoodService = async (id) => {
  try {
    const deletedFood = await deleteRecommendedFood(id);
    return deletedFood;
  } catch (error) {
    console.error("Error deleting recommended food:", error);
    throw error;
  }
};
