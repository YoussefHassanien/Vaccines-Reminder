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
 * Get all products from the database with their reviews and user details
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit number of products (optional)
 * @param {number} options.skip - Skip number of products for pagination (optional)
 * @param {Object} options.sort - Sort criteria (optional, default: { createdAt: -1 })
 * @returns {Promise<Array>} Array of products with populated reviews
 */
export const getAllProducts = async () => {
  try {
    const products = await Product.find()
      .select("-__v -createdAt -updatedAt") // Exclude version key
      .populate({
        path: "reviews",
        select: "message rating createdAt", // Select specific review fields
        populate: {
          path: "userId",
          select: "fName lName", // Select specific user fields
          model: "User",
        },
        options: {
          sort: { createdAt: -1 }, // Sort reviews by newest first
        },
      })
      .lean();

    if (!products) {
      throw new Error("No products found");
    }

    // Format the products and calculate review statistics
    const formattedProducts = products.map((product) => {
      const reviews = product.reviews || [];

      return {
        ...product,
        totalReviews: reviews.length,
        reviews: reviews.map((review) => ({
          _id: review._id,
          message: review.message,
          rating: review.rating,
          createdAt: review.createdAt,
          user: review.userId
            ? {
                _id: review.userId._id,
                name: `${review.userId.fName} ${review.userId.lName}`,
              }
            : null,
        })),
      };
    });

    return formattedProducts;
  } catch (error) {
    console.error("Error fetching products with reviews:", error);
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
