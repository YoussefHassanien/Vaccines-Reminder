import { insertCart, fetchUserCartDetails } from "./services.js";

export const createCart = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { cart, products } = req.body;

  try {
    cart.userId = userId;
    cart.productsCount = parseInt(cart.productsCount, 10);
    cart.totalPrice = parseFloat(cart.totalPrice);
    const { statusCode, message, data, error } = await insertCart(
      cart,
      products
    );

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const retreiveUserCartDetails = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { cartId } = req.params;
  try {
    const { statusCode, message, data, error } = await fetchUserCartDetails(
      userId,
      cartId
    );
    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: message,
        error: error,
      });
    }
    return res.status(statusCode).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, error: error.error });
  }
};
