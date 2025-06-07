import {
  insertCart,
  fetchUserPendingCartDetails,
  insertCartProduct,
  deleteCartProduct,
  changeCartProductQuantity,
  fetchProductById,
  changeProductQuantity,
  changeCartTotalPrice,
  changeCartProductsCount,
  fetchCartProductsByCartId,
  deleteCart,
  changeCartStatus,
  fetchUserOnlinePaidAndWaitingCarts,
  adminChangeCartStatus,
  changeCartPaymentType,
  fetchAllUsersCarts,
} from "./services.js";

/**
 * Creates a new cart for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createCart = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { cart } = req.body;

  try {
    cart.userId = userId;
    cart.productsCount = parseInt(cart.productsCount, 10) || 0;
    cart.totalPrice = parseFloat(cart.totalPrice) || 0;

    const { statusCode, message, data, error } = await insertCart(cart);

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

/**
 * Retrieves cart details for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveUserPendingCartDetails = async (req, res) => {
  const user = req.user;
  const userId = user._id;

  try {
    const {
      statusCode: cartResponseStatusCode,
      message: cartResponseMessage,
      data: cartDetails,
      error: cartResponseError,
    } = await fetchUserPendingCartDetails(userId);

    if (cartResponseStatusCode !== 200) {
      return res
        .status(cartResponseStatusCode)
        .json({ message: cartResponseMessage, error: cartResponseError });
    }

    const {
      statusCode: cartProductsResponseStatusCode,
      message: cartProductsResponseMessage,
      data: cartProductsDetails,
      error: cartProductsResponseError,
    } = await fetchCartProductsByCartId(cartDetails._id);

    if (cartProductsResponseStatusCode === 500) {
      return res.status(cartProductsResponseStatusCode).json({
        message: cartProductsResponseMessage,
        error: cartProductsResponseError,
      });
    }

    return res.status(cartResponseStatusCode).json({
      message: cartResponseMessage,
      data: {
        cart: cartDetails,
        products:
          cartProductsResponseStatusCode === 404 ? [] : cartProductsDetails,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error.error,
    });
  }
};

/**
 * Creates a new cart product (adds product to cart)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createCartProduct = async (req, res) => {
  const { productId, quantity } = req.body;
  const { cartId } = req.params;

  try {
    // Get product information to calculate price
    const { statusCode, data: product } = await fetchProductById(productId);

    if (statusCode !== 200 || !product) {
      return res.status(404).json({
        message: `Product with ID ${productId} not found`,
      });
    }

    // Ensure we have valid numeric values for calculation
    const productPrice = Number(product.price);
    const productQuantity = parseInt(quantity, 10);

    // Calculate the total price for this product based on quantity
    const price = productPrice * productQuantity;

    const cartProductData = {
      cartId, // Now correctly contains the string, not an object
      productId,
      quantity: productQuantity,
      price,
    };

    const result = await insertCartProduct(cartProductData);

    // If successful, update cart totals
    if (result.statusCode === 201) {
      // Update product inventory
      await changeProductQuantity(productId, -productQuantity);

      // Update cart totals
      await changeCartTotalPrice(cartId, price);
      await changeCartProductsCount(cartId, 1);
    }

    return res.status(result.statusCode).json({
      message: result.message,
      data: result.data,
      error: result.error,
    });
  } catch (error) {
    console.error("Error creating cart product:", error);
    return res.status(500).json({
      message: "Error creating cart product",
      error: error.message,
    });
  }
};

/**
 * Removes a product from a cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const eraseCartProduct = async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    // Get cart product details before deletion to adjust totals
    const {
      message: cartProductsResponseMessage,
      error: cartProductsResponseError,
      statusCode: cartProductsResponseStatusCode,
      data: cartProducts,
    } = await fetchCartProductsByCartId(cartId);

    if (cartProductsResponseStatusCode !== 200) {
      return res.status(cartProductsResponseStatusCode).json({
        message: cartProductsResponseMessage,
        error: cartProductsResponseError,
      });
    }

    const productToDelete = cartProducts.find(
      (p) => p.productId.toString() === productId
    );

    // Delete the cart product
    const { statusCode, message, data, error } = await deleteCartProduct(
      productId,
      cartId
    );

    // If successful, update related values
    if (statusCode === 200) {
      // Return product to inventory
      await changeProductQuantity(
        productId,
        parseInt(productToDelete.quantity)
      );

      // Update cart totals
      await changeCartTotalPrice(cartId, -productToDelete.price);
      await changeCartProductsCount(
        cartId,
        -parseInt(productToDelete.quantity)
      );
    }

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error removing product from cart",
      error: error.error,
    });
  }
};

/**
 * Updates the quantity of a product in a cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const modifyCartProductQuantity = async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;
  const newQuantity = parseInt(quantity, 10);

  try {
    // Get current cart product to calculate difference
    const {
      message: cartProductsResponseMessage,
      error: cartProductsResponseError,
      data: cartProducts,
      statusCode: cartProductsResponseStatusCode,
    } = await fetchCartProductsByCartId(cartId);

    if (cartProductsResponseStatusCode !== 200) {
      return res.status(cartProductsResponseStatusCode).json({
        message: cartProductsResponseMessage,
        error: cartProductsResponseError,
      });
    }

    const currentProduct = cartProducts.find(
      (p) => p.productId.toString() === productId
    );

    // Calculate quantity and price differences
    const quantityDifference =
      newQuantity - parseInt(currentProduct.quantity, 10);
    const priceDifference =
      quantityDifference *
      (parseFloat(currentProduct.price) /
        parseInt(currentProduct.quantity, 10));

    // Update cart product quantity
    const { statusCode, message, data, error } =
      await changeCartProductQuantity(productId, cartId, quantityDifference);

    // Update related totals
    if (statusCode === 200) {
      // Update product inventory
      await changeProductQuantity(productId, -quantityDifference);

      // Update cart total price
      await changeCartTotalPrice(cartId, priceDifference);

      // Update cart products count
      await changeCartProductsCount(cartId, quantityDifference);
    }

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error updating product quantity",
      error: error.error,
    });
  }
};

/**
 * Deletes an entire cart and its products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const eraseCart = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { cartId } = req.params;

  try {
    // Get cart products before deletion to update inventory
    const cartProducts = await fetchCartProductsByCartId(cartId);

    // Delete the cart and its products
    const { statusCode, message, data, error } = await deleteCart(
      userId,
      cartId
    );

    // If deletion was successful, update product quantities in inventory
    if (statusCode === 200 && cartProducts && cartProducts.length > 0) {
      // Process all products to return quantities to inventory
      for (const product of cartProducts) {
        await changeProductQuantity(
          product.productId,
          product.quantity // Add the quantity back to inventory
        );
      }
    }

    return res.status(statusCode).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error deleting cart",
      error: error.error,
    });
  }
};

export const modifyCartStatus = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { cartId } = req.params;

  try {
    const { statusCode, message, data, error } = await changeCartStatus(
      cartId,
      userId
    );

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error updating cart status",
      error: error.error,
    });
  }
};

/**
 * Retrieves user's confirmed and waiting carts with their products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveUserOnlinePaidAndWaitingCarts = async (req, res) => {
  const user = req.user;
  const userId = user._id;

  try {
    const { statusCode, message, data, error } =
      await fetchUserOnlinePaidAndWaitingCarts(userId);

    // If the request was not successful, return early
    if (statusCode !== 200) {
      return res.status(statusCode).json({ message, data, error });
    }

    // Check if we have carts to process
    if (!data?.carts || data.carts.length === 0) {
      return res.status(statusCode).json({ message, data, error });
    }

    // Attach products to each cart
    const cartsWithProducts = await Promise.all(
      data.carts.map(async (cart) => {
        try {
          const {
            statusCode: cartProductsStatusCode,
            message: cartProductsMessage,
            data: cartProducts,
            error: cartProductsError,
          } = await fetchCartProductsByCartId(cart._id);

          // Attach products to cart based on the response
          return {
            ...cart,
            products: cartProductsStatusCode === 200 ? cartProducts : [],
            productsCount:
              cartProductsStatusCode === 200 ? cartProducts.length : 0,
          };
        } catch (productError) {
          console.warn(
            `Failed to fetch products for cart ${cart._id}:`,
            productError
          );
          // Return cart with empty products array if fetching fails
          return {
            ...cart,
            products: [],
            productsCount: 0,
          };
        }
      })
    );

    // Return the enhanced data with products attached to each cart
    return res.status(statusCode).json({
      message,
      data: {
        ...data,
        carts: cartsWithProducts,
      },
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Error retrieving user's confirmed and waiting carts",
      error: error.error,
    });
  }
};

export const adminModifyCartStatus = async (req, res) => {
  const { cartId } = req.params;
  const { status } = req.body;

  try {
    const { statusCode, message, data } = await adminChangeCartStatus(
      cartId,
      status
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const modifyCartPaymentType = async (req, res) => {
  const { cartId } = req.params;
  const user = req.user;
  const { paymentType } = req.body;

  try {
    const { statusCode, message, data } = await changeCartPaymentType(
      cartId,
      user._id,
      paymentType
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

/**
 * Retrieves all users' carts with their products (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveAllUsersCarts = async (req, res) => {
  try {
    const { data } = await fetchAllUsersCarts();

    // Attach products to each cart
    const cartsWithProducts = await Promise.all(
      data.carts.map(async (cart) => {
        try {
          const {
            statusCode: cartProductsStatusCode,
            message: cartProductsMessage,
            data: cartProducts,
            error: cartProductsError,
          } = await fetchCartProductsByCartId(cart._id);

          // Attach products to cart based on the response
          return {
            ...cart,
            products: cartProductsStatusCode === 200 ? cartProducts : [],
            productsCount:
              cartProductsStatusCode === 200 ? cartProducts.length : 0,
          };
        } catch (productError) {
          console.warn(
            `Failed to fetch products for cart ${cart._id}:`,
            productError
          );
          // Return cart with empty products array if fetching fails
          return {
            ...cart,
            products: [],
            productsCount: 0,
          };
        }
      })
    );

    // Group carts by user
    const userCartsMap = new Map();

    cartsWithProducts.forEach((cart) => {
      // Check if userId exists and has required properties
      if (!cart.userId || !cart.userId._id) {
        console.warn(`Cart ${cart._id} has no valid user data, skipping...`);
        return;
      }

      const userId = cart.userId._id.toString();

      if (!userCartsMap.has(userId)) {
        userCartsMap.set(userId, {
          user: {
            _id: cart.userId._id,
            fName: cart.userId.fName,
            lName: cart.userId.lName,
            email: cart.userId.email,
            phoneNumber: cart.userId.phoneNumber,
            carts: [],
          },
        });
      }

      // Format cart data according to the requested structure
      const formattedCart = {
        _id: cart._id,
        productsCount: cart.productsCount,
        totalPrice: cart.totalPrice,
        status: cart.status,
        governorate: cart.governorate,
        city: cart.city,
        street: cart.street,
        buildingNumber: cart.buildingNumber,
        apartmentNumber: cart.apartmentNumber,
        paymentType: cart.paymentType,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        products: cart.products.map((product) => ({
          _id: product.productId, // ✅ Fixed: use productId instead of product.product._id
          name: product.name, // ✅ Fixed: direct access to name
          image: product.image, // ✅ Fixed: direct access to image
          requiredAge: product.requiredAge, // ✅ Fixed: direct access to requiredAge
          quantity: product.quantity,
          price: product.price,
        })),
      };

      userCartsMap.get(userId).user.carts.push(formattedCart);
    });

    // Convert map to array
    const usersWithCarts = Array.from(userCartsMap.values());

    return res.status(200).json({
      message: "All users' carts retrieved successfully",
      data: usersWithCarts,
      error: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error retrieving all users' carts",
      error: error.error || error.message,
    });
  }
};
