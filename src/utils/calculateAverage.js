/**
 * Calculate new average when adding a value to existing dataset
 * @param {Number} oldAverage - Current average of the dataset
 * @param {Number} totalCount - Current count of items in the dataset
 * @param {Number} newValue - New value to be added to or deleted from the dataset
 * @returns {Number} New average rounded to 1 decimal place
 */
export const calculateAverage = (oldAverage, totalCount, newValue) => {
  // Handle edge cases
  if (totalCount < 0) {
    throw new Error("Total count cannot be negative");
  }

  if (totalCount === 0) {
    return Math.abs(newValue);
  }

  // Calculate total sum from old average and count
  const oldTotal = oldAverage * totalCount;

  let newTotal = 0;
  let newCount = 0;
  let newAverage = 0;

  if (newValue < 0) {
    // Subtract new value from total
    newTotal = oldTotal - newValue;

    // Calculate new count
    newCount = totalCount - 1;
  } else {
    // Add new value to total
    newTotal = oldTotal + newValue;

    // Calculate new count
    newCount = totalCount + 1;
  }

  // Calculate and new average
  newAverage = newTotal / newCount;

  // Round to 1 decimal place
  return Math.round(newAverage * 10) / 10;
};
