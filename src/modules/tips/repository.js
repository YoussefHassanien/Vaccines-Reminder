import PregnancyTips from "../../models/pregnancyTipsModel.js";
import Milestone from "../../models/milestonesModel.js";
import Trimester from "../../models/trimesterModel.js";
import RecommendedFood from "../../models/recommendedFoodModel.js";

/**
 * Fetches all pregnancy tips from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of pregnancy tips.
 */
export const getAllPregnancyTips = async () => {
  try {
    const tips = await PregnancyTips.find().lean();
    return tips.map((tip) => ({
      _id: tip._id.toString(),
      title: tip.title,
      content: tip.content,
    }));
  } catch (error) {
    console.error("Error fetching pregnancy tips:", error);
    throw error;
  }
};

/**
 * Fetches a single pregnancy tip by ID.
 * @param {string} id - The ID of the tip to retrieve.
 * @returns {Promise<Object|null>} The pregnancy tip or null if not found.
 */
export const getPregnancyTipById = async (id) => {
  try {
    const tip = await PregnancyTips.findById(id).lean();
    if (!tip) return null;
    return {
      _id: tip._id.toString(),
      title: tip.title,
      content: tip.content,
    };
  } catch (error) {
    console.error("Error fetching tip by ID:", error);
    throw error;
  }
};

/**
 * Creates a new pregnancy tip.
 * @param {Object} data - The tip data { title, content }.
 * @returns {Promise<Object>} The created pregnancy tip.
 */
export const createPregnancyTip = async (data) => {
  try {
    const newTip = await PregnancyTips.create(data);
    return {
      _id: newTip._id.toString(),
      title: newTip.title,
      content: newTip.content,
    };
  } catch (error) {
    console.error("Error creating pregnancy tip:", error);
    throw error;
  }
};

/**
 * Updates an existing pregnancy tip by ID.
 * @param {string} id - The ID of the tip to update.
 * @param {Object} data - Updated data { title, content }.
 * @returns {Promise<Object|null>} The updated tip or null if not found.
 */
export const updatePregnancyTip = async (id, data) => {
  try {
    const updated = await PregnancyTips.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return null;
    return {
      _id: updated._id.toString(),
      title: updated.title,
      content: updated.content,
    };
  } catch (error) {
    console.error("Error updating pregnancy tip:", error);
    throw error;
  }
};

/**
 * Deletes a pregnancy tip by ID.
 * @param {string} id - The ID of the tip to delete.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
export const deletePregnancyTip = async (id) => {
  try {
    const deleted = await PregnancyTips.findByIdAndDelete(id);
    return !!deleted;
  } catch (error) {
    console.error("Error deleting pregnancy tip:", error);
    throw error;
  }
};

/**
 * Fetches all milestones from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of milestones.
 */
export const getAllMilestones = async () => {
  try {
    const milestones = await Milestone.find().lean();
    return milestones.map((milestone) => ({
      _id: milestone._id.toString(),
      week: milestone.weekNumber,
      content: milestone.content,
    }));
  } catch (error) {
    console.error("Error fetching milestones:", error);
    throw error;
  }
};

/**
 * Fetches a milestone by ID.
 * @param {string} id - The ID of the milestone to retrieve.
 * @returns {Promise<Object|null>} The milestone or null if not found.
 */
export const getMilestoneById = async (id) => {
  try {
    const milestone = await Milestone.findById(id).lean();
    if (!milestone) return null;
    return {
      _id: milestone._id.toString(),
      week: milestone.weekNumber,
      content: milestone.content,
    };
  } catch (error) {
    console.error("Error fetching milestone by ID:", error);
    throw error;
  }
};

/**
 * Creates a new milestone.
 * @param {Object} data - The milestone data { weekNumber, content }.
 * @returns {Promise<Object>} The created milestone.
 */
export const createMilestone = async (data) => {
  try {
    const newMilestone = await Milestone.create(data);
    return {
      _id: newMilestone._id.toString(),
      week: newMilestone.weekNumber,
      content: newMilestone.content,
    };
  } catch (error) {
    console.error("Error creating milestone:", error);
    throw error;
  }
};

/**
 * Updates an existing milestone by ID.
 * @param {string} id - The ID of the milestone to update.
 * @param {Object} data - Updated data { weekNumber, content }.
 * @returns {Promise<Object|null>} The updated milestone or null if not found.
 */
export const updateMilestone = async (id, data) => {
  try {
    const updated = await Milestone.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return null;
    return {
      _id: updated._id.toString(),
      week: updated.weekNumber,
      content: updated.content,
    };
  } catch (error) {
    console.error("Error updating milestone:", error);
    throw error;
  }
};

/**
 * Deletes a milestone by ID.
 * @param {string} id - The ID of the milestone to delete.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
export const deleteMilestone = async (id) => {
  try {
    const deleted = await Milestone.findByIdAndDelete(id);
    return !!deleted;
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw error;
  }
};

/**
 * Fetches all trimesters and groups them by trimester number.
 * @returns {Promise<Object>} A promise that resolves to an object grouped by trimester number.
 */
export const getAllTrimesters = async () => {
  try {
    const trimesters = await Trimester.find().lean();

    const grouped = {};

    trimesters.forEach((trimester) => {
      const key = trimester.number;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({
        _id: trimester._id.toString(),
        content: trimester.content,
      });
    });

    return grouped;
  } catch (error) {
    console.error("Error fetching trimesters:", error);
    throw error;
  }
};

/**
 * Fetches a single trimester entry by its ID.
 * @param {string} id - The ID of the trimester entry.
 * @returns {Promise<Object|null>} The trimester entry or null if not found.
 */
export const getTrimesterById = async (id) => {
  try {
    const trimester = await Trimester.findById(id).lean();
    if (!trimester) return null;
    return {
      _id: trimester._id.toString(),
      number: trimester.number,
      content: trimester.content,
    };
  } catch (error) {
    console.error("Error fetching trimester by ID:", error);
    throw error;
  }
};

/**
 * Creates a new trimester entry.
 * @param {Object} data - The trimester data { number, content }.
 * @returns {Promise<Object>} The created trimester entry.
 */
export const createTrimester = async (data) => {
  try {
    const newTrimester = await Trimester.create(data);
    return {
      _id: newTrimester._id.toString(),
      number: newTrimester.number,
      content: newTrimester.content,
    };
  } catch (error) {
    console.error("Error creating trimester:", error);
    throw error;
  }
};

/**
 * Updates a trimester entry by ID.
 * @param {string} id - The ID of the trimester entry to update.
 * @param {Object} data - The updated data { number, content }.
 * @returns {Promise<Object|null>} The updated trimester or null if not found.
 */
export const updateTrimester = async (id, data) => {
  try {
    const updated = await Trimester.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return null;
    return {
      _id: updated._id.toString(),
      number: updated.number,
      content: updated.content,
    };
  } catch (error) {
    console.error("Error updating trimester:", error);
    throw error;
  }
};

/**
 * Deletes a trimester entry by ID.
 * @param {string} id - The ID of the trimester entry to delete.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
export const deleteTrimester = async (id) => {
  try {
    const deleted = await Trimester.findByIdAndDelete(id);
    return !!deleted;
  } catch (error) {
    console.error("Error deleting trimester:", error);
    throw error;
  }
};

/**
 * Fetches all recommended foods.
 * @returns {Promise<Array>} A promise that resolves to an array of recommended foods.
 */
export const getAllRecommendedFoods = async () => {
  try {
    const foods = await RecommendedFood.find().lean();
    return foods.map((food) => ({
      _id: food._id.toString(),
      name: food.name,
      imgUrl: food.imgUrl,
    }));
  } catch (error) {
    console.error("Error fetching recommended foods:", error);
    throw error;
  }
};

/**
 * Fetches a recommended food by ID.
 * @param {string} id - The ID of the food to retrieve.
 * @returns {Promise<Object|null>} The recommended food or null if not found.
 */
export const getRecommendedFoodById = async (id) => {
  try {
    const food = await RecommendedFood.findById(id).lean();
    if (!food) return null;
    return {
      _id: food._id.toString(),
      name: food.name,
      imgUrl: food.imgUrl,
    };
  } catch (error) {
    console.error("Error fetching food by ID:", error);
    throw error;
  }
};

/**
 * Creates a new recommended food.
 * @param {Object} data - The food data { name, imgUrl }.
 * @returns {Promise<Object>} The created recommended food.
 */
export const createRecommendedFood = async (data) => {
  try {
    const newFood = await RecommendedFood.create(data);
    return {
      _id: newFood._id.toString(),
      name: newFood.name,
      imgUrl: newFood.imgUrl,
    };
  } catch (error) {
    console.error("Error creating recommended food:", error);
    throw error;
  }
};

/**
 * Updates a recommended food by ID.
 * @param {string} id - The ID of the food to update.
 * @param {Object} data - Updated data { name, imgUrl }.
 * @returns {Promise<Object|null>} The updated food or null if not found.
 */
export const updateRecommendedFood = async (id, data) => {
  try {
    const updated = await RecommendedFood.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return null;
    return {
      _id: updated._id.toString(),
      name: updated.name,
      imgUrl: updated.imgUrl,
    };
  } catch (error) {
    console.error("Error updating recommended food:", error);
    throw error;
  }
};

/**
 * Deletes a recommended food by ID.
 * @param {string} id - The ID of the food to delete.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
export const deleteRecommendedFood = async (id) => {
  try {
    const deleted = await RecommendedFood.findByIdAndDelete(id);
    return !!deleted;
  } catch (error) {
    console.error("Error deleting recommended food:", error);
    throw error;
  }
};
