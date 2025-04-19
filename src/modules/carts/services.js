import { addCart, addCartProduct, getUserCartDetails } from "./repository.js";

export const insertCart = async (cartData) => {
  try {
    const cart = await addCart(cartData);
    return {
      statusCode: 201,
      message: "Cart is successfully created",
      data: cart,
    };
  } catch (error) {
    return {
      message: "Error inserting cart",
      error: error.message,
    };
  }
};

export const fetchUserCartDetails = async (userId) => {};
