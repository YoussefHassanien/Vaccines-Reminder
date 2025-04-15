/**
 * Check if a value is a valid non-empty string
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a valid non-empty string, false otherwise
 */
export const isValidString = (value) => {
  return typeof value === "string" && value.trim() !== "";
};

/**
 * Check if a value is an integer
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is an integer, false otherwise
 */
export const isInteger = (value) => {
  return typeof value === "number" && Number.isInteger(value);
};
