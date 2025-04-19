import {
  addCart,
  addCartProduct,
  getUserCartDetails,
  getUserById,
} from "./repository.js";

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
      statusCode: 500,
      message: "Error inserting cart",
      error: error.message,
    };
  }
};

export const fetchUserCartDetails = async (userId) => {
  try {
    const userCart = await getUserCartDetails(userId);
    if (!userCart) {
      return {
        statusCode: 404,
        message: `Could not find user cart of user id: ${userId}`,
      };
    }
    return {
      statusCode: 200,
      message: `User cart of user id: ${userId}, retrieved successfully`,
      data: userCart,
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
