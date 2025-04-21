import Child from "../../models/childModel.js";

/**
 * Create and save a new Child in the database
 * @param {Object} childData - Child information
 * @param {string} childData.userId - Child name
 * @param {number} childData.birthDate - Child price
 * @param {string} childData.gender - Child description
 * @param {string} childData.bloodType - Child image URL
 * @param {number} childData.ssn - Child quantity
 *  * @param {number} childData.birthCertificate - Child quantity
 * @returns {Promise<Object>} Created Child document
 */
export const addNewChild = async (childData) => {
  try {
    const child = new Child(childData);
    const savedChild = await child.save();

    // Convert to plain object and remove unwanted fields
    const childObj = savedChild.toObject();
    delete childObj.createdAt;
    delete childObj.updatedAt;
    delete childObj.__v;

    return childObj;
  } catch (error) {
    console.error("Error inserting child:", error);
    throw error;
  }
};

/**
 * Get all children from the database with pagination
 * @param {number} cursor - id of last retreived children
 * @param {number} limit - Number of children per page
 * @returns {Promise<Object>} children array and pagination metadata
 */
export const getPaginatedChildren = async (cursor, limit) => {
  try {
    const query = cursor
      ? { _id: { $gt: cursor } } // Fetch children with `_id` greater than the cursor
      : {};

    const children = await Child.find(query)
      .select("-createdAt -updatedAt -__v")
      .sort({ _id: 1 }) // Sort by `_id` in ascending order
      .limit(limit);

    return children;
  } catch (error) {
    console.error("Error fetching children by cursor:", error);
    throw error;
  }
};

/**
 * Delete a Child by ID
 * @param {string} id - Child ID
 * @returns {Promise<Object>} Deleted Child document
 */
export const deleteChild = async (id) => {
  try {
    const child = await Child.findByIdAndDelete(id);

    if (!child) {
      throw new Error("child not found");
    }

    return child;
  } catch (error) {
    console.error(`Error deleting child with ID ${id}:`, error);
    throw error;
  }
};
