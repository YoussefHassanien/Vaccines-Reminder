import {
  addNewChildService,
  fetchPaginatedChildrenService,
  deleteChildService,
  uploadToCloudinary,
  getImageCloudinaryUrl,
  getChildrenByUser,
} from "./services.js";

import { runVaccineReminderNow } from "../../../jobs/vaccinesRemindersJob.js";

export const addNewChild = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "birth certificate is required" });
  }
  try {
    const userId = req.user._id;
    const { name, birthDate, gender, bloodType, ssn } = req.body;
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const optimizedChildBirthCertificateUrl = getImageCloudinaryUrl(
      cloudinaryResult.public_id
    );
    if (!optimizedChildBirthCertificateUrl) {
      return res.status(400).json({
        message: "Could not retrieve child birth certificate optimized URL",
      });
    }

    // Insert child into the database
    const { status, message, data, error } = await addNewChildService({
      userId,
      name,
      birthDate,
      gender,
      bloodType,
      ssn,
      birthCertificate: optimizedChildBirthCertificateUrl,
    });

    // Check if the new added child needs a reminder
    await runVaccineReminderNow();

    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const retrievePaginatedChildren = async (req, res) => {
  try {
    const { cursor, limit } = req.query;
    const { status, message, data, error } =
      await fetchPaginatedChildrenService(cursor, parseInt(limit, 10) || 10);

    // Get the last product's `_id` to use as the next cursor
    const nextCursor = data.length > 0 ? data[data.length - 1]._id : null;

    return res.status(status).json({ message, data, error, nextCursor });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const retriveCurrentUserChildren = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, message, data, error } = await getChildrenByUser(userId);

    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, data, error } = await deleteChildService(id);
    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};
