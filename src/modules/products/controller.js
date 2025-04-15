import {
  getImageCloudinaryUrl,
  insertNewProduct,
  uploadToCloudinary,
} from "./services.js";
import { isInteger, isValidString } from "./validation.js";

export const createNewProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Product image is required" });
  }
  const { name, description } = req.body;
  const price = parseFloat(req.body.price);
  const quantity = parseFloat(req.body.quantity);

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }
  if (!name) {
    return res.status(400).json({ message: "Product name is missing" });
  }
  if (!price) {
    return res.status(400).json({ message: "Product price is missing" });
  }
  if (!description) {
    return res.status(400).json({ message: "Product description is missing" });
  }
  if (!quantity) {
    return res.status(400).json({ message: "Product quantity is missing" });
  }
  if (!isValidString(name)) {
    return res
      .status(400)
      .json({ message: "Product name is not a valid string" });
  }
  if (!isValidString(description)) {
    return res
      .status(400)
      .json({ message: "Product description is not a valid string" });
  }
  if (!isInteger(quantity) || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Product quantity is not valid positive integer" });
  }
  try {
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
        .json({ message: "Could not retrieve product image optimized url" });
    }

    const { status, message, data, error } = await insertNewProduct({
      name: name,
      price: price,
      description: description,
      quantity: quantity,
      image: optimizedProductImageUrl,
    });

    return res
      .status(status)
      .json({ message: message, data: data, error: error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};
