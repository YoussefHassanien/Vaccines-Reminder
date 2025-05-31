import {
  getImageCloudinaryUrl,
  uploadToCloudinary,
  getNurseSlotsService,
  bookNurseSlot,
  getFreeNurseSlots,
  createNewNurseService,
  fetchPaginatedNurse,
  deleteNurseById,
} from "./services.js";

export const createNewNurse = async (req, res) => {
  try {
    const optimizedProfileImageUrl = null;
    const { fName, lName, email, phone, hospitalName } = req.body;
    if (req.file) {
      // Upload image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      optimizedProfileImageUrl = getImageCloudinaryUrl(
        cloudinaryResult.public_id
      );

      if (!optimizedProfileImageUrl) {
        return res.status(400).json({
          message: "Could not retrieve nurse profile picture optimized URL",
        });
      }
    }

    // Insert nurse into the database
    const { status, message, data, error } = await createNewNurseService({
      fName,
      lName,
      email,
      phone,
      hospitalName,
      profileImage: optimizedProfileImageUrl || null,
    });

    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const getAllPaginatedNurses = async (req, res) => {
  try {
    const { cursor, limit } = req.query;
    const { status, message, data, error } = await fetchPaginatedNurse(
      cursor,
      limit
    );
    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const getNurseSlots = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const { status, message, data, error } = await getNurseSlotsService(
      nurseId
    );
    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const assignNurseToVaccineRequest = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const { slotId, vaccineId } = req.body;
    const { status, message, error } = await bookNurseSlot(
      slotId,
      vaccineId,
      nurseId
    );

    return res.status(status).json({
      message: message,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const getFreeNurseSlotsById = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const { status, message, data, error } = await getFreeNurseSlots(nurseId);
    return res.status(status).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};

export const deleteNurse = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const { status, message, error } = await deleteNurseById(nurseId);
    return res.status(status).json({ message, error });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
  }
};
