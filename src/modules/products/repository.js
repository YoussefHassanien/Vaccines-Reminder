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
export const addNewProduct = async (productData) => {
  try {
    const product = new Product(productData);
    const savedProduct = await product.save();

    // Convert to plain object and remove unwanted fields
    const productObj = savedProduct.toObject();
    delete productObj.createdAt;
    delete productObj.updatedAt;
    delete productObj.__v;

    return productObj;
  } catch (error) {
    console.error("Error inserting product:", error);
    throw error;
  }
};

/**
 * Get all products from the database with pagination
 * @param {number} cursor - id of last retreived product
 * @param {number} limit - Number of products per page
 * @returns {Promise<Object>} Products array and pagination metadata
 */
export const getPaginatedProducts = async (cursor, limit) => {
  try {
    const query = cursor
      ? { _id: { $gt: cursor } } // Fetch products with `_id` greater than the cursor
      : {};

    const products = await Product.find(query)
      .select("-createdAt -updatedAt -__v")
      .sort({ _id: 1 }) // Sort by `_id` in ascending order
      .limit(limit);

    return products;
  } catch (error) {
    console.error("Error fetching products by cursor:", error);
    throw error;
  }
};

/**
 * Update a product by ID
 * @param {string} id - Product ID
 * @param {Object} updateData - Updated product information
 * @returns {Promise<Object>} Updated product document
 */
export const updateProductQuantity = async (id, quantity) => {
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { quantity: quantity },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    const formattedProduct = product.toObject();
    delete formattedProduct.createdAt;
    delete formattedProduct.__v;

    return formattedProduct;
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
