import { insertCart, fetchUserCartDetails, fetchUserById } from "./services.js";

export const createCart = async (req, res) => {
  const userId = "6802e4ea61822738b4d1b340";
  const {
    productsCount,
    totalPrice,
    status,
    governorate,
    city,
    street,
    buildingNumber,
    appartmentNumber,
    paymentType,
  } = req.body;
  try {
    const user = await fetchUserById(userId);
    if (!user.statusCode === 200) {
      return res.status(user.statusCode).json({
        message: user.message,
        error: user.error,
      });
    }
    const { statusCode, message, data, error } = await insertCart({
      userId,
      productsCount: parseInt(productsCount, 10),
      totalPrice: parseFloat(totalPrice),
      status,
      governorate,
      city,
      street,
      buildingNumber,
      appartmentNumber,
      paymentType,
    });

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const retreiveUserCartDetails = async (req, res) => {
  const userId = "6802e4ea61822738b4d1b340";
  try {
    const user = await fetchUserById(userId);
    if (!user.statusCode === 200) {
      return res.status(user.statusCode).json({
        message: user.message,
        error: user.error,
      });
    }
    const { statusCode, message, data, error } = await fetchUserCartDetails(
      userId
    );
    if (!statusCode === 200) {
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
