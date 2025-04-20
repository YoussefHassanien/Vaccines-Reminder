import {
  addCart,
  // addCartProduct,
  getUserCartDetails,
  getUserById,
  getProductById,
  getCartProductsByCartId,
} from "./repository.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

export const insertCart = async (cart, products) => {
  try {
    // 1. Create the cart first
    const databaseCart = await addCart(cart);

    // 2. Initialize array for added products
    let cartProducts = [];

    // 3. Loop through each product
    for (const product of products) {
      // Add the cart ID to each product
      product.cartId = databaseCart._id;

      // Add the product to the cart
      const addedCartProduct = await addCartProduct(product);
      cartProducts.push(addedCartProduct);
    }

    const formattedCart = formatMongoDbObjects(databaseCart);

    // Check that all products have been added successfully
    if (cartProducts.length !== products.length) {
      return {
        statusCode: 400,
        message: "Could not insert all cart products",
      };
    }
    return {
      statusCode: 201,
      message: "Cart is successfully created",
      data: formattedCart,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error inserting cart",
      error: error.message,
    };
  }
};

export const fetchUserCartDetails = async (userId, cartId) => {
  try {
    const userCart = await getUserCartDetails(userId, cartId);
    if (!userCart) {
      return {
        statusCode: 404,
        message: `Could not find user cart of user id: ${userId}`,
      };
    }

    const cartProducts = await getCartProductsByCartId(cartId);

    if (!cartProducts) {
      return {
        statusCode: 404,
        message: "Cart has no products",
      };
    }

    return {
      statusCode: 200,
      message: `User cart of user id: ${userId}, retrieved successfully`,
      data: { cart: userCart, products: cartProducts },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error finding user cart of user id: ${userId}`,
      error: error.message,
    };
  }
};

export const fetchUserById = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return {
        statusCode: 404,
        message: `Could not find user of user id: ${userId}`,
      };
    }
    return {
      statusCode: 200,
      message: `User of user id: ${userId}, retrieved successfully`,
      data: user,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error finding user of user id: ${userId}`,
      error: error.message,
    };
  }
};

export const fetchProductById = async (productId) => {
  try {
    const product = await getProductById(productId);
    if (!product) {
      return {
        statusCode: 404,
        message: `Could not find product of product id: ${productId}`,
      };
    }
    return {
      statusCode: 200,
      message: `Product of product id: ${productId}, retrieved successfully`,
      data: product,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error finding product of product id: ${productId}`,
      error: error.message,
    };
  }
};

// export const insertCartProduct = async () => {};
