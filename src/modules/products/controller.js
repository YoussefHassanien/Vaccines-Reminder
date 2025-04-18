import {
  getImageCloudinaryUrl,
  insertNewProduct,
  uploadToCloudinary,
  fetchPaginatedProducts,
  changeProductQuantity,
  removeProduct,
} from "./services.js";

export const createNewProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Product image is required" });
  }

  try {
    const { name, description, price, quantity, features, requiredAge } =
      req.body;

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const optimizedProductImageUrl = getImageCloudinaryUrl(
      cloudinaryResult.public_id
    );

    if (!optimizedProductImageUrl) {
      return res
        .status(400)
        .json({ message: "Could not retrieve product image optimized URL" });
    }

    // Insert product into the database
    const { status, message, data, error } = await insertNewProduct({
      name,
      price: parseFloat(price),
      description,
      quantity: parseInt(quantity, 10),
      image: optimizedProductImageUrl,
      requiredAge,
      features,
    });

    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const retrievePaginatedProducts = async (req, res) => {
  try {
    const { cursor, limit } = req.query;
    const { status, message, data, error } = await fetchPaginatedProducts(
      cursor,
      parseInt(limit, 10) || 10
    );

    // Get the last product's `_id` to use as the next cursor
    const nextCursor = data.length > 0 ? data[data.length - 1]._id : null;

    return res.status(status).json({
      message,
      data,
      nextCursor,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const modifyProductQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const { status, message, data, error } = await changeProductQuantity(
      id,
      parseInt(quantity, 10)
    );

    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const eraseProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, message, data, error } = await removeProduct(id);

    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error.error,
    });
  }
};
