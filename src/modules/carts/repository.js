import CartProduct from "../../models/cartProductModel.js";
import Cart from "../../models/cartModel.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import mongoose from "mongoose";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

/**
 * Adds a new product to a cart
 * @param {Object} cartProductData - Data for the cart product to be added
 * @param {String} cartProductData.cartId - MongoDB ObjectId of the cart
 * @param {String} cartProductData.productId - MongoDB ObjectId of the product
 * @param {Number} cartProductData.quantity - Quantity of the product
 * @param {Number} cartProductData.price - Price of the product(s)
 * @returns {Promise<Object>} Object containing the added cart product
 */
export const addCartProduct = async (cartProductData) => {
  try {
    const cartProduct = new CartProduct(cartProductData);
    const savedCartProduct = await cartProduct.save();

    // Convert to plain object and remove unwanted fields
    const formattedCartProduct = formatMongoDbObjects(savedCartProduct);

    return { addedCartProduct: formattedCartProduct };
  } catch (error) {
    console.error("Error inserting cart product", error);
    throw error;
  }
};

/**
 * Removes a product from a cart and updates the cart totals
 * @param {String} cartProductId - MongoDB ObjectId of the cart product to remove
 * @returns {Promise<Object>} Result of the operation
 */
export const removeCartProduct = async (productId, cartId) => {
  try {
    // 1. Find the cart product to get its details before deletion
    const cartProduct = await CartProduct.findOne({
      productId,
      cartId,
    });
    if (!cartProduct) {
      throw new Error(
        `Cart product with id: ${cartProduct._id} and cart id: ${cartProduct.cartId} not found!`
      );
    }

    await CartProduct.findByIdAndDelete(cartProduct._id);

    // Convert to plain object and remove unwanted fields
    const formattedCartProduct = formatMongoDbObjects(cartProduct);
    return {
      removedProduct: formattedCartProduct,
    };
  } catch (error) {
    console.error("Error removing cart product", error);
    throw error;
  }
};

/**
 * Creates a new cart in the database
 * @param {Object} cartData - Data for the cart to be created
 * @param {String} cartData.userId - MongoDB ObjectId of the user
 * @param {Number} [cartData.productsCount=0] - Initial number of products
 * @param {Number} [cartData.totalPrice=0] - Initial total price
 * @param {String} [cartData.status="Pending"] - Cart status
 * @returns {Promise<Object>} Created cart document
 */
export const addCart = async (cartData) => {
  try {
    const cart = new Cart(cartData);
    const savedCart = await cart.save();

    // Convert to plain object and remove unwanted fields
    const formattedCart = formatMongoDbObjects(savedCart);

    return formattedCart;
  } catch (error) {
    console.error("Error inserting cart", error);
    throw error;
  }
};

/**
 * Get a specific cart for a user by cart ID
 * @param {String} userId - MongoDB ObjectId of the user
 * @param {String} cartId - MongoDB ObjectId of the cart
 * @returns {Promise<Object|null>} The cart or null if not found
 */
export const getUserPendingCartDetails = async (userId) => {
  try {
    // Find carts for this user
    const cart = await Cart.findOne({ userId, status: "Pending" })
      .select("-__v -updatedAt -createdAt")
      .lean();

    return cart;
  } catch (error) {
    console.error(`Error finding cart for user id: ${userId}`, error);
    throw error;
  }
};

/**
 * Find a user by ID
 * @param {String} userId - MongoDB ObjectId of the user to find
 * @returns {Promise<Object|null>} User document or null if not found
 */
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).lean();
    return user;
  } catch (error) {
    console.error(`Error finding user of user id: ${userId}`, error);
    throw error;
  }
};

/**
 * Find a product by ID
 * @param {String} productId - MongoDB ObjectId of the product to find
 * @returns {Promise<Object|null>} Product document or null if not found
 */
export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).lean();
    return product;
  } catch (error) {
    console.error(`Error finding product of product id: ${productId}`, error);
    throw error;
  }
};

/**
 * Update a product's quantity by ID
 * @param {string} id - Product ID
 * @param {number} quantity - Quantity to add (positive) or remove (negative)
 * @returns {Promise<Object>} Updated product document
 */
export const updateProductQuantity = async (id, quantity) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error(`Product with id: ${id} not found!`);
    }

    // Calculate new quantity
    const newQuantity = product.quantity + quantity;

    // Prevent negative inventory
    if (newQuantity < 0) {
      throw new Error(
        `Cannot reduce quantity of product with id: ${id} below zero`
      );
    }

    // Update quantity
    product.quantity = newQuantity;
    await product.save();

    return formatMongoDbObjects(product);
  } catch (error) {
    console.error(`Error updating quantity of product with id: ${id}`, error);
    throw error;
  }
};

/**
 * Get all cart products for a specific cart
 * @param {String} cartId - MongoDB ObjectId of the cart
 * @returns {Promise<Array>} Array of cart products with product details
 */
export const getCartProductsByCartId = async (cartId) => {
  try {
    // Find all cart products for this cart
    const cartProducts = await CartProduct.find({ cartId })
      .select("-__v -updatedAt -createdAt")
      .lean();

    if (!cartProducts || cartProducts.length === 0) {
      return [];
    }

    // Get all product IDs from cart products
    const productIds = cartProducts.map((product) => product.productId);

    // Fetch all products in a single query for better performance
    const products = await Product.find({ _id: { $in: productIds } })
      .select("name image requiredAge")
      .lean();

    // Create a map of products by ID for quick lookup
    const productsMap = {};
    products.forEach((product) => {
      productsMap[product._id.toString()] = product;
    });

    // Combine cart product data with product details
    const enrichedCartProducts = cartProducts.map((cartProduct) => {
      const productId = cartProduct.productId.toString();
      const productDetails = productsMap[productId];

      // Return combined object with data from both collections
      return {
        productId: cartProduct.productId,
        name: productDetails?.name,
        image: productDetails?.image,
        requiredAge: productDetails?.requiredAge,
        quantity: cartProduct.quantity,
        price: cartProduct.price,
      };
    });

    return enrichedCartProducts;
  } catch (error) {
    console.error(
      `Error finding cart products for cart with id: ${cartId}`,
      error
    );
    throw error;
  }
};

/**
 * Updates the total price of a cart
 * @param {String} cartId - MongoDB ObjectId of the cart
 * @param {Number} totalPrice - Amount to add (positive) or subtract (negative) from the cart's total price
 * @returns {Promise<Object>} Updated cart document
 * @throws {Error} If cart not found or total price would become negative
 */
export const updateCartTotalPrice = async (cartId, totalPrice) => {
  try {
    const cart = await Cart.findOne({ _id: cartId, status: "Pending" });
    if (!cart) {
      throw new Error(`Cart with id: ${cartId} not found!`);
    }

    const newTotalPrice = cart.totalPrice + totalPrice;

    // Prevent negative values
    if (newTotalPrice < 0) {
      throw new Error(
        `Cannot reduce cart total price: ${cart.totalPrice} to be below zero, given price: ${totalPrice}`
      );
    }

    cart.totalPrice = newTotalPrice;
    await cart.save();

    return formatMongoDbObjects(cart);
  } catch (error) {
    console.error(
      `Error updating total price of cart with id: ${cartId}`,
      error
    );
    throw error;
  }
};

/**
 * Updates the products count in a cart
 * @param {String} cartId - MongoDB ObjectId of the cart
 * @param {Number} productsCount - Amount to add (positive) or subtract (negative) from the cart's products count
 * @returns {Promise<Object>} Updated cart document
 * @throws {Error} If cart not found or products count would become negative
 */
export const updateCartProductsCount = async (cartId, productsCount) => {
  try {
    const cart = await Cart.findOne({ _id: cartId, status: "Pending" });
    if (!cart) {
      throw new Error(`Cart with id: ${cartId} not found!`);
    }

    const newProductsCount = Number(cart.productsCount) + productsCount;

    // Prevent negative values
    if (newProductsCount < 0) {
      throw new Error(
        `Cannot reduce cart products count: ${cart.productsCount} to be below zero, given products count: ${productsCount}`
      );
    }

    cart.productsCount = newProductsCount;
    await cart.save();

    return formatMongoDbObjects(cart);
  } catch (error) {
    console.error(
      `Error updating products count of cart with id: ${cartId}`,
      error
    );
    throw error;
  }
};

/**
 * Updates the quantity of a product in a cart
 * @param {String} productId - MongoDB ObjectId of the product
 * @param {String} cartId - MongoDB ObjectId of the cart
 * @param {Number} quantity - Amount to add (positive) or subtract (negative) from the product quantity
 * @returns {Promise<Object>} Updated cart product document
 * @throws {Error} If cart product not found or quantity would become negative
 */
export const updateCartProductQuantity = async (
  productId,
  cartId,
  quantity
) => {
  try {
    const cartProduct = await CartProduct.findOne({ productId, cartId });
    if (!cartProduct) {
      throw new Error(
        `No cart product of product id: ${productId} and cart id: ${cartId} found!`
      );
    }

    const newCartProductQuantity = cartProduct.quantity + quantity;

    if (newCartProductQuantity < 0) {
      throw new Error(
        `Cannot reduce cart product quantity: ${cartProduct.quantity} to be below zero, given cart product quantity: ${quantity}`
      );
    }

    cartProduct.quantity = newCartProductQuantity;
    await cartProduct.save();

    return formatMongoDbObjects(cartProduct);
  } catch (error) {
    console.error(
      `Error updating quantity of cart product with product id: ${productId} and cart id: ${cartId}`,
      error
    );
    throw error;
  }
};

/**
 * Delete a cart and its associated products
 * @param {String} cartId - MongoDB ObjectId of the cart
 * @param {String} userId - MongoDB ObjectId of the cart owner
 * @returns {Promise<Object>} Deleted cart document
 * @throws {Error} If cart not found or doesn't belong to user
 */
export const removeCart = async (cartId, userId) => {
  try {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // First find the cart to verify ownership and get info for return
      const cart = await Cart.findOne({
        _id: cartId,
        userId,
        status: "Pending",
      });

      if (!cart) {
        throw new Error(
          `Cart with id: ${cartId} not found for user with id: ${userId}`
        );
      }

      // Find all cart products to return products to inventory
      const cartProducts = await CartProduct.find({ cartId }).session(session);

      // Delete all cart products
      await CartProduct.deleteMany({ cartId }).session(session);

      // Delete the cart
      const deletedCart = await Cart.findByIdAndDelete(cartId).session(session);

      // Commit the transaction
      await session.commitTransaction();

      // Return the cart details and products for use in inventory updates
      return {
        deletedCart: formatMongoDbObjects(deletedCart),
        cartProducts: cartProducts.map((product) =>
          formatMongoDbObjects(product)
        ),
      };
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      session.endSession();
    }
  } catch (error) {
    console.error(`Error deleting cart with id: ${cartId}`, error);
    throw error;
  }
};

export const updateCartStatus = async (cartId, userId) => {
  try {
    const cart = await Cart.findOne({
      _id: cartId,
      userId,
      status: "Pending",
      paymentType: "Cash",
    });

    if (!cart) {
      throw new Error(
        `Cart with id: ${cartId} not found for user with id: ${userId}`
      );
    }

    cart.status = "Waiting for cash payment";
    await cart.save();

    return formatMongoDbObjects(cart);
  } catch (error) {
    console.error(
      `Error updating status of cart with user id: ${userId} and cart id: ${cartId}`,
      error
    );
    throw error;
  }
};

/**
 * Get user's carts with status "Confirmed" or "Waiting for cash payment"
 * @param {String} userId - MongoDB ObjectId of the user
 * @returns {Promise<Array>} Array of user's confirmed and waiting carts
 */
export const getUserConfirmedAndWaitingCarts = async (userId) => {
  try {
    // Get user's carts with "Confirmed" or "Waiting for cash payment" status
    const carts = await Cart.find({
      userId,
      status: { $in: ["Confirmed", "Waiting for cash payment", "Delivered"] },
    })
      .sort({ updatedAt: -1 })
      .select("-__v -createdAt -updatedAt") // Exclude unwanted fields
      .lean(); // Get plain objects

    return carts || []; // Return empty array if no carts found
  } catch (error) {
    console.error(
      `Error fetching confirmed and waiting carts for user id: ${userId}`,
      error
    );
    throw error;
  }
};
