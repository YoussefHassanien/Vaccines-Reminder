import CartProduct from "../../models/cartProductModel.js";
import Cart from "../../models/cartModel.js";
import User from "../../models/userModel.js";

export const addCartProduct = async (cartProductData) => {
  try {
    const cartProduct = new CartProduct(cartProductData);
    const savedCartProduct = await cartProduct.save();

    // Convert to plain object and remove unwanted fields
    const cartProductObj = savedCartProduct.toObject();
    delete cartProductObj.createdAt;
    delete cartProductObj.updatedAt;
    delete cartProductObj.__v;

    return cartProductObj;
  } catch (error) {
    console.error("Error inserting cart product:", error);
    throw error;
  }
};

export const addCart = async (cartData) => {
  try {
    const cart = new Cart(cartData);
    const savedCart = await cart.save();

    // Convert to plain object and remove unwanted fields
    const cartObj = savedCart.toObject();
    delete cartObj.createdAt;
    delete cartObj.updatedAt;
    delete cartObj.__v;

    return cartObj;
  } catch (error) {
    console.error("Error inserting cart:", error);
    throw error;
  }
};

/**
 * Get the most recent cart for a specific user
 * @param {String} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object|null>} The most recent cart or null if no carts found
 */
export const getUserCartDetails = async (userId) => {
  try {
    // Find carts for this user, sort by creation date (newest first), limit to 1
    const cart = await Cart.findOne({ userId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .select("-__v -updatedAt -createdAt")
      .lean(); // Use lean() for better performance when you don't need Mongoose document methods

    return cart;
  } catch (error) {
    console.error(`Error finding recent cart for user ${userId}:`, error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }
    return true;
  } catch (error) {}
};
