import {
  addCart,
  addCartProduct,
  getUserPendingCartDetails,
  getUserById,
  getProductById,
  getCartProductsByCartId,
  updateCartProductQuantity,
  updateCartProductsCount,
  updateCartTotalPrice,
  updateProductQuantity,
  removeCartProduct,
  removeCart,
  updateCartStatus,
  getUserOnlinePaidAndWaitingCarts,
  adminUpdateCartStatus,
  updateCartPaymentType,
} from "./repository.js";

/**
 * Creates a new cart in the database
 * @param {Object} cart - Cart data to insert
 * @returns {Object} Response with status code and message
 */
export const insertCart = async (cart) => {
  try {
    const databaseCart = await addCart(cart);
    return {
      statusCode: 201,
      message: "Cart is successfully created",
      data: databaseCart,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error inserting cart",
      error: error.message,
    };
  }
};

/**
 * Adds a product to a cart
 * @param {Object} cartProductData - Cart product data to insert
 * @returns {Object} Response with status code and message
 */
export const insertCartProduct = async (cartProductData) => {
  try {
    const result = await addCartProduct(cartProductData);
    return {
      statusCode: 201,
      message: "Product is successfully added to cart",
      data: result.addedCartProduct,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error adding product to cart",
      error: error.message,
    };
  }
};

/**
 * Fetches cart details for a specific user and cart ID
 * @param {String} userId - User ID
 * @param {String} cartId - Cart ID
 * @returns {Object} Response with status code and message
 */
export const fetchUserPendingCartDetails = async (userId) => {
  try {
    const userCart = await getUserPendingCartDetails(userId);
    if (!userCart) {
      return {
        statusCode: 404,
        message: `Could not find pending cart for user: ${userId}`,
      };
    }

    return {
      statusCode: 200,
      message: `Pendingcart retrieved successfully`,
      data: userCart,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error finding cart`,
      error: error.message,
    };
  }
};

/**
 * Fetches all products in a specific cart
 * @param {String} cartId - Cart ID
 * @returns {Object} Response with status code and message
 */
export const fetchCartProductsByCartId = async (cartId) => {
  try {
    const cartProducts = await getCartProductsByCartId(cartId);

    if (!cartProducts || cartProducts.length === 0) {
      return {
        statusCode: 404,
        message: "Cart has no products",
      };
    }

    return {
      statusCode: 200,
      message: "Cart products retrieved successfully",
      data: cartProducts,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error finding cart products`,
      error: error.message,
    };
  }
};

/**
 * Fetches user information by ID
 * @param {String} userId - User ID
 * @returns {Object} Response with status code and message
 */
export const fetchUserById = async (userId) => {
  try {
    const user = await getUserById(userId);

    return {
      statusCode: 200,
      message: `User retrieved successfully`,
      data: user,
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }

    throw {
      statusCode: 500,
      message: `Error finding user`,
      error: error.message,
    };
  }
};

/**
 * Fetches product information by ID
 * @param {String} productId - Product ID
 * @returns {Object} Response with status code and message
 */
export const fetchProductById = async (productId) => {
  try {
    const product = await getProductById(productId);
    if (!product) {
      return {
        statusCode: 404,
        message: `Could not find product with ID: ${productId}`,
      };
    }
    return {
      statusCode: 200,
      message: `Product retrieved successfully`,
      data: product,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error finding product`,
      error: error.message,
    };
  }
};

/**
 * Updates a product quantity in inventory
 * @param {String} productId - Product ID
 * @param {Number} quantity - Quantity to add or subtract
 * @returns {Object} Response with status code and message
 */
export const changeProductQuantity = async (productId, quantity) => {
  try {
    const updatedProduct = await updateProductQuantity(productId, quantity);
    return {
      statusCode: 200,
      message: `Product quantity updated successfully`,
      data: updatedProduct,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error updating product quantity`,
      error: error.message,
    };
  }
};

/**
 * Updates cart total price
 * @param {String} cartId - Cart ID
 * @param {Number} price - Price to add or subtract
 * @returns {Object} Response with status code and message
 */
export const changeCartTotalPrice = async (cartId, price) => {
  try {
    const updatedCart = await updateCartTotalPrice(cartId, price);
    return {
      statusCode: 200,
      message: `Cart total price updated successfully`,
      data: updatedCart,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error updating cart total price`,
      error: error.message,
    };
  }
};

/**
 * Removes a product from a cart
 * @param {String} productId - Product ID
 * @param {String} cartId - Cart ID
 * @returns {Object} Response with status code and message
 */
export const deleteCartProduct = async (productId, cartId) => {
  try {
    const result = await removeCartProduct(productId, cartId);
    return {
      statusCode: 200,
      message: `Product removed from cart successfully`,
      data: result.removedProduct,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error removing product from cart`,
      error: error.message,
    };
  }
};

/**
 * Updates the quantity of a cart product
 * @param {String} cartProductId - Cart product ID
 * @param {Number} quantity - New quantity for the cart product
 * @returns {Object} Response with status code and message
 */
export const changeCartProductQuantity = async (
  productId,
  cartId,
  quantity
) => {
  try {
    const updatedCartProduct = await updateCartProductQuantity(
      productId,
      cartId,
      quantity
    );

    if (!updatedCartProduct) {
      return {
        statusCode: 404,
        message: `Cart product with ID: ${productId} not found`,
      };
    }

    return {
      statusCode: 200,
      message: `Cart product quantity updated successfully`,
      data: updatedCartProduct,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error updating cart product quantity`,
      error: error.message,
    };
  }
};

/**
 * Updates the products count in a cart
 * @param {String} cartId - Cart ID
 * @param {Number} count - Count value to add or subtract
 * @returns {Object} Response with status code and message
 */
export const changeCartProductsCount = async (cartId, count) => {
  try {
    const updatedCart = await updateCartProductsCount(cartId, count);

    if (!updatedCart) {
      return {
        statusCode: 404,
        message: `Cart with ID: ${cartId} not found`,
      };
    }

    return {
      statusCode: 200,
      message: `Cart products count updated successfully`,
      data: updatedCart,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error updating cart products count`,
      error: error.message,
    };
  }
};

/**
 * Removes a cart and its associated products
 * @param {String} userId - User ID
 * @param {String} cartId - Cart ID
 * @returns {Object} Response with status code and message
 */
export const deleteCart = async (userId, cartId) => {
  try {
    const result = await removeCart(cartId, userId);

    return {
      statusCode: 200,
      message: "Cart deleted successfully",
      data: {
        deletedCart: result.deletedCart,
      },
    };
  } catch (error) {
    // Handle specific errors
    if (
      error.message.includes("not found") ||
      error.message.includes("Cannot delete")
    ) {
      return {
        statusCode: 400,
        message: error.message,
        error: error.message,
      };
    }

    return {
      statusCode: 500,
      message: "Error deleting cart",
      error: error.message,
    };
  }
};

export const changeCartStatus = async (cartId, userId) => {
  try {
    const cart = await updateCartStatus(cartId, userId);

    return {
      statusCode: 200,
      message: "Cart status is updated successfully",
      data: {
        confirmedCart: cart,
      },
    };
  } catch (error) {
    // Handle specific error cases
    if (
      error.message.includes("not found") ||
      error.message.includes("not eligible")
    ) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }

    return {
      statusCode: 500,
      message: "Error updating cart status",
      error: error.message,
    };
  }
};

/**
 * Fetches user's confirmed and waiting carts
 * @param {String} userId - User ID
 * @returns {Object} Response with status code and message
 */
export const fetchUserOnlinePaidAndWaitingCarts = async (userId) => {
  try {
    const carts = await getUserOnlinePaidAndWaitingCarts(userId);

    if (!carts || carts.length === 0) {
      return {
        statusCode: 404,
        message:
          "No confirmed or waiting for cash payment carts found for this user",
      };
    }

    return {
      statusCode: 200,
      message:
        "User's confirmed, waiting for cash payment and delivered carts retrieved successfully",
      data: { carts },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message:
        "Error retrieving user's confirmed and waiting for cash payment carts",
      error: error.message,
    };
  }
};

export const adminChangeCartStatus = async (cartId, status) => {
  try {
    const updatedCart = await adminUpdateCartStatus(cartId, status);

    return {
      statusCode: 200,
      message: `Cart status is updated successfully`,
      data: {
        cart: updatedCart,
      },
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error updating cart status",
      error: error.message,
    };
  }
};

export const changeCartPaymentType = async (cartId, userId, paymentType) => {
  try {
    const cart = await updateCartPaymentType(cartId, userId, paymentType);

    return {
      statusCode: 200,
      message: "Cart payment type is updated successfully",
      data: {
        cart,
      },
    };
  } catch (error) {
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error updating cart payment type",
      error: error.message,
    };
  }
};
