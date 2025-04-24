import User from "../../models/userModel.js";

/**
 * Create and save a new user in the database
 * @param {Object} userData - User information
 * @returns {Promise<Object>} Created user document
 */
export const getUser = async (userId) => {
  try {
    const user = await User.findById(userId).lean(); // 1. await + lean()

    if (!user) {
      throw new Error("User not found");
    }

    // 2. remove unwanted fields
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user.password;

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Find a user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} Found user document or null
 */
export const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error(`Error finding user by email (${email}):`, error);
    throw error;
  }
};

/**
 * Find a user by ID
 * @param {string} id - User's ID
 * @returns {Promise<Object|null>} Found user document or null
 */
export const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(`Error finding user by ID (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {string} id - User's ID
 * @returns {Promise<Object|null>} Deleted user document or null
 */
export const deleteUserById = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting user by ID (${id}):`, error);
    throw error;
  }
};

/**
 * Update user by ID
 * @param {string} id - User's ID
 * @param {Object} updateData - Updated fields
 * @returns {Promise<Object|null>} Updated user document or null
 */
export const updateUserById = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error(`Error updating user by ID (${id}):`, error);
    throw error;
  }
};
