import { MulterError } from "multer";

/**
 * Middleware to handle Multer-specific errors during file uploads
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const multerErrorHandler = (err, req, res, next) => {
  // If there's no error, continue to the next middleware
  if (!err) {
    return next();
  }

  // Handle Multer-specific errors
  if (err instanceof MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 5MB.",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected field or too many files provided.",
        });

      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files uploaded. Please upload fewer files.",
        });

      default:
        return res.status(500).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
    }
  }

  // Handle errors from Cloudinary or file type validation
  if (err.message && err.message.includes("Unsupported file type")) {
    return res.status(400).json({
      success: false,
      message: "Unsupported file type. Only images and PDFs are allowed.",
    });
  }

  // Handle Cloudinary errors
  if (err.message && err.message.includes("Cloudinary")) {
    return res.status(500).json({
      success: false,
      message: "Error uploading to cloud storage. Please try again later.",
    });
  }

  // For any other errors, pass to the main error handler
  next(err);
};

export default multerErrorHandler;
