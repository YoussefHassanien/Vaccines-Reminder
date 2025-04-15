import Product from "../../models/productModel.js";

/**
 * Create and save a new product in the database
 * @param {Object} productData - Product information
 * @param {string} productData.name - Product name
 * @param {number} productData.price - Product price
 * @param {string} productData.description - Product description
 * @param {string} productData.image - Product image URL
 * @param {number} productData.quantity - Product quantity
 * @returns {Promise<Object>} Created product document
 */
export const insertProduct = async (productData) => {
  try {
    const product = new Product(productData);
    return await product.save();
  } catch (error) {
    console.error("Error inserting product:", error);
    throw error;
  }
};

/**
 * Get all products from the database
 * @returns {Promise<Array>} Array of product documents
 */
export const getAllProducts = async () => {
  try {
    return await Product.find();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product document
 */
export const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update a product by ID
 * @param {string} id - Product ID
 * @param {Object} updateData - Updated product information
 * @returns {Promise<Object>} Updated product document
 */
export const updateProduct = async (id, updateData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Deleted product document
 */
export const deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
