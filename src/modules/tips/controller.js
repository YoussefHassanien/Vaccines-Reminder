import e from "express";
import {
  getAllTipsData,
  createMilestoneService,
  createPregnancyTipService,
  createRecommendedFoodService,
  createTrimesterService,
  getImageCloudinaryUrl,
  uploadToCloudinary,
  deleteMilestoneService,
  deletePregnancyTipService,
  deleteRecommendedFoodService,
  deleteTrimesterService,
} from "./service.js";

export const getAllTips = async (req, res) => {
  try {
    const tipsData = await getAllTipsData();
    res.status(200).json({
      status: "success",
      data: tipsData,
    });
  } catch (error) {
    console.error("Error fetching all tips:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch tips data",
    });
  }
};

export const createMilestone = async (req, res) => {
  try {
    const milestoneData = req.body;
    const newMilestone = await createMilestoneService(milestoneData);
    res.status(201).json({
      status: "success",
      data: newMilestone,
    });
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create milestone",
    });
  }
};

export const createTrimester = async (req, res) => {
  try {
    const trimesterData = req.body;
    const newTrimester = await createTrimesterService(trimesterData);
    res.status(201).json({
      status: "success",
      data: newTrimester,
    });
  } catch (error) {
    console.error("Error creating trimester:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create trimester",
    });
  }
};
export const createPregnancyTip = async (req, res) => {
  try {
    const tipData = req.body;
    const newTip = await createPregnancyTipService(tipData);
    res.status(201).json({
      status: "success",
      data: newTip,
    });
  } catch (error) {
    console.error("Error creating pregnancy tip:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create pregnancy tip",
    });
  }
};

export const createRecommendedFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "food image is required" });
  }

  try {
    const { name } = req.body;

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const optimizedProductImageUrl = getImageCloudinaryUrl(
      cloudinaryResult.public_id
    );

    if (!optimizedProductImageUrl) {
      return res
        .status(400)
        .json({ message: "Could not retrieve product image optimized URL" });
    }

    const foodData = {
      name: name,
      imgUrl: optimizedProductImageUrl,
    };
    const newFood = await createRecommendedFoodService(foodData);
    res.status(201).json({
      status: "success",
      data: newFood,
    });
  } catch (error) {
    console.error("Error creating recommended food:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create recommended food",
    });
  }
};

export const deleteMilestone = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMilestone = await deleteMilestoneService(id);
    if (!deletedMilestone) {
      return res.status(404).json({
        status: "error",
        message: "Milestone not found",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete milestone",
    });
  }
};
export const deleteTrimester = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTrimester = await deleteTrimesterService(id);
    if (!deletedTrimester) {
      return res.status(404).json({
        status: "error",
        message: "Trimester not found",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting trimester:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete trimester",
    });
  }
};
export const deletePregnancyTip = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTip = await deletePregnancyTipService(id);
    if (!deletedTip) {
      return res.status(404).json({
        status: "error",
        message: "Pregnancy tip not found",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting pregnancy tip:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete pregnancy tip",
    });
  }
};
export const deleteRecommendedFood = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFood = await deleteRecommendedFoodService(id);
    if (!deletedFood) {
      return res.status(404).json({
        status: "error",
        message: "Recommended food not found",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting recommended food:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete recommended food",
    });
  }
};
