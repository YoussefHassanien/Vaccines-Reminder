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
 * @param {number} page - Page number (starting from 1)
 * @param {number} limit - Number of products per page
 * @returns {Promise<Object>} Products array and pagination metadata
 */
export const getAllProducts = async (page, limit) => {
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .select("-createdAt -updatedAt -__v")
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    return {
      products,
      pagination: {
        total: totalProducts,
        page: page,
        limit: limit,
        pages: Math.ceil(totalProducts / limit),
      },
    };
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
