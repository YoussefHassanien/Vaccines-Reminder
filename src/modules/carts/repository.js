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
export const getUserCartDetails = async (userId, cartId) => {
  try {
    // Find carts for this user, sort by creation date (newest first)
    const cart = await Cart.findOne({ userId, status: "Pending", _id: cartId })
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
    console.error(`Error finding cart products for cart: ${cartId}`, error);
    throw error;
  }
};
