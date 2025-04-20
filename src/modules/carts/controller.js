import {
  insertCart,
  fetchUserCartDetails,
  fetchUserById,
  fetchProductById,
} from "./services.js";

export const createCart = async (req, res) => {
  const userId = "6802e4ea61822738b4d1b340";
  const { cart, products } = req.body;

  try {
    const user = await fetchUserById(userId);
    if (user.statusCode !== 200) {
      return res.status(user.statusCode).json({
        message: user.message,
        error: user.error,
      });
    }

    for (const product of products) {
      const productResponse = await fetchProductById(product.productId);

      // Check response status
      if (productResponse.statusCode !== 200) {
        return res.status(productResponse.statusCode).json({
          message: productResponse.message,
        });
      }

      // Get the actual product data from the response
      const databaseProduct = productResponse.data;

      // Now properly calculate the price
      const totalPrice = Number(databaseProduct.price * product.quantity);

      // Compare with the provided price
      if (Math.abs(Number(product.price) - totalPrice) > 0.01) {
        return res.status(400).json({
          message: `Product of id: ${product.productId} price: ${totalPrice} does not match the given price: ${product.price}`,
        });
      }
    }

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
  const userId = "6802e4ea61822738b4d1b340";
  const { cartId } = req.params;
  try {
    const user = await fetchUserById(userId);
    if (user.statusCode !== 200) {
      return res.status(user.statusCode).json({
        message: user.message,
        error: user.error,
      });
    }
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

export const createCartProduct = async (req, res) => {};
