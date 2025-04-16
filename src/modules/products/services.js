import cloudinary from "../../../config/cloudinary.js";
import {
  insertProduct,
  getPaginatedProducts,
  updateProductQuantity,
} from "./repository.js";
import { Readable } from "stream";
import path from "path";

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {String} filename - Original filename
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Vaccines-Reminder/Products",
        public_id: `${Date.now()}-${path.basename(
          filename,
          path.extname(filename)
        )}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    readableStream.pipe(uploadStream);
  });
};

export const getImageCloudinaryUrl = (publicId) => {
  if (!publicId) return false;
  try {
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl;
  } catch (error) {
    console.log("Error getting the image url", error);
    return null;
  }
};

export const insertNewProduct = async (productData) => {
  try {
    const newProduct = await insertProduct(productData);
    if (!newProduct) {
      return {
        status: 500,
        message: "Error inserting product",
      };
    }
    return {
      status: 201,
      message: "Product is successfully created",
      data: newProduct,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error inserting product",
      error: error.message,
    };
  }
};

export const fetchPaginatedProducts = async (cursor, limit) => {
  try {
    const products = await getPaginatedProducts(cursor, limit);
    if (!products) {
      return {
        status: 500,
        message: "Error getting all products",
      };
    }
    return {
      status: 200,
      message: "Products are successfully retrieved",
      data: products,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error getting all products",
      error: error.message,
    };
  }
};

export const changeProductQuantity = async (id, quantity) => {
  try {
    const product = await updateProductQuantity(id, quantity);
    if (!product) {
      return {
        status: 400,
        message: `Could not find the product of ID: ${id}`,
      };
    }
    return {
      status: 200,
      message: `Product with ID ${id} updated successfully`,
      data: product,
    };
  } catch (error) {
    return {
      status: 500,
      message: `Error updating product quantity of ID ${id}`,
      error: error.message,
    };
  }
};
