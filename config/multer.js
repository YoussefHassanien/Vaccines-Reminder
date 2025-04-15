import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import path from "path";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const baseFolder = "Vaccines-Reminder/";
    let folder, resourceType, format;

    // Get proper file extension regardless of dots in filename
    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);

    // Determine folder and resource type based on MIME type
    if (file.mimetype.startsWith("image/")) {
      folder = `${baseFolder}Products`;
      resourceType = "image";
      format = fileExtension || file.mimetype.split("/")[1];
    } else if (file.mimetype === "application/pdf") {
      folder = `${baseFolder}Certificates`;
      resourceType = "raw";
      format = "pdf";
    } else {
      // Handle unsupported file types
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    return {
      folder,
      format,
      resourceType,
      public_id: `${Date.now()}-${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}`,
    };
  },
});

// Add file size and type limits
const multerUploadHandler = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

export default multerUploadHandler;
