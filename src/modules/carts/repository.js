import CartProduct from "../../models/cartProductModel.js";
import Cart from "../../models/cartModel.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

export const addCartProduct = async (cartProductData) => {
  try {
    const cartProduct = new CartProduct(cartProductData);
    const savedCartProduct = await cartProduct.save();

    await updateProductQuantity(
      savedCartProduct.productId,
      -savedCartProduct.quantity
    );

    // Convert to plain object and remove unwanted fields
    const formattedCartProduct = formatMongoDbObjects(savedCartProduct);

    return { addedCartProduct: formattedCartProduct };
  } catch (error) {
    console.error("Error inserting cart product:", error);
    throw error;
  }
};

/**
 * Removes a product from a cart and updates the cart totals
 * @param {String} cartProductId - MongoDB ObjectId of the cart product to remove
 * @returns {Promise<Object>} Result of the operation
 */
export const removeCartProduct = async (cartProductId, cartId) => {
  try {
    // 1. Find the cart product to get its details before deletion
    const cartProduct = await CartProduct.findOne({
      _id: cartProductId,
      cartId,
    });
    if (!cartProduct) {
      throw new Error(
        `Cart product with id: ${cartProductId} and cart id: ${cartId} not found`
      );
    }

    await updateProductQuantity(cartProduct.productId, cartProduct.quantity);

    await CartProduct.findByIdAndDelete(cartProductId);

    // Convert to plain object and remove unwanted fields
    const formattedCartProduct = formatMongoDbObjects(cartProduct);
    return {
      removedProduct: formattedCartProduct,
    };
  } catch (error) {
    console.error("Error removing cart product:", error);
    throw error;
  }
};

export const addCart = async (cartData) => {
  try {
    const cart = new Cart(cartData);
    const savedCart = await cart.save();

    // Convert to plain object and remove unwanted fields
    const formattedCart = formatMongoDbObjects(savedCart);

    return formattedCart;
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
    // Find carts for this user, sort by creation date (newest first)
    const cart = await Cart.findOne({ userId, status: "Pending" })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .select("-__v -updatedAt -createdAt")
      .lean(); // Use lean() for better performance when you don't need Mongoose document methods

    return cart;
  } catch (error) {
    console.error(`Error finding recent cart for user id: ${userId}`, error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).lean();
    return user;
  } catch (error) {
    console.error(`Error finding user: ${userId}`, error);
    throw error;
  }
};

const updateCartTotals = async (cartId, productsCount, totalPrice) => {
  // Ensure parameters are numbers
  const countChange = Number(productsCount) || 0;
  const priceChange = Number(totalPrice) || 0;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    throw new Error(`Cart with ID ${cartId} not found`);
  }

  // Update totals
  cart.totalPrice += priceChange;
  cart.productsCount += countChange;

  // Prevent negative values
  if (cart.totalPrice < 0) {
    throw new Error(
      `Cannot reduce cart total price: ${cart.totalPrice} to be below zero, given price: ${priceChange}`
    );
  }
  if (cart.productsCount < 0) {
    throw new Error(
      `Cannot reduce cart products count: ${cart.productsCount} to be below zero, given count: ${countChange}`
    );
  }

  await cart.save();

  return cart;
};

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).lean();
    return product;
  } catch (error) {
    console.error(`Error finding product: ${productId}`, error);
    throw error;
  }
};

/**
 * Update a product's quantity by ID
 * @param {string} id - Product ID
 * @param {number} quantity - Quantity to add (positive) or remove (negative)
 * @returns {Promise<Object>} Updated product document
 */
const updateProductQuantity = async (id, quantity) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // Calculate new quantity
    const newQuantity = product.quantity + quantity;

    // Prevent negative inventory
    if (newQuantity < 0) {
      throw new Error(
        `Cannot reduce quantity of product ${id}. Only ${product.quantity} remaining.`
      );
    }

    // Update quantity
    product.quantity = newQuantity;
    await product.save();

    return formatMongoDbObjects(product);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};
