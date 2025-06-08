import {
  insertVaccineRequest,
  fetchAllVaccinesRequests,
  fetchUserVaccineRequests,
  deleteUserVaccineRequest,
  changeNurseSlotIsBooked,
  changeVaccineRequestStatus,
  addCertificateToVaccineRequestService,
  getVaccineCertificateService,
  uploadToCloudinary,
  getImageCloudinaryUrl,
} from "./services.js";

/**
 * Creates a new vaccine request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createVaccineRequest = async (req, res) => {
  const {
    childId,
    vaccineId,
    vaccinationDate,
    governorate,
    phoneNumber,
    city,
    street,
    buildingNumber,
    apartmentNumber,
  } = req.body;

  try {
    // Validate and parse numeric values to avoid type errors
    const vaccineRequestData = {
      parentId: req.user._id,
      childId,
      vaccineId,
      vaccinationDate: new Date(vaccinationDate),
      governorate,
      phoneNumber,
      city,
      street,
      buildingNumber: parseInt(buildingNumber, 10),
      apartmentNumber: parseInt(apartmentNumber, 10),
    };

    const { statusCode, message, data, error } = await insertVaccineRequest(
      vaccineRequestData
    );

    return res.status(statusCode).json({ message, data, error });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error creating vaccine request",
      error: error.error,
    });
  }
};

/**
 * Retrieves all vaccine requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const retrieveVaccineRequests = async (req, res) => {
  try {
    const { statusCode, message, data, error } =
      await fetchAllVaccinesRequests();

    return res.status(statusCode).json({
      message,
      data,
      error,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error retrieving vaccine requests",
      error: error.error,
    });
  }
};

export const retrieveUserVaccineRequests = async (req, res) => {
  const user = req.user;

  try {
    const { statusCode, message, data } = await fetchUserVaccineRequests(
      user._id
    );
    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const cancelUserVaccineRequest = async (req, res) => {
  const vaccineRequest = req.vaccineRequest;

  try {
    if (vaccineRequest.status === "Confirmed") {
      await changeNurseSlotIsBooked(vaccineRequest.nurseSlotId);
    }

    const { statusCode, message, data } = await deleteUserVaccineRequest(
      vaccineRequest._id
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const modifyVaccineRequestStatus = async (req, res) => {
  const { vaccineRequestId } = req.params;
  const { status } = req.body;

  try {
    const { statusCode, message, data } = await changeVaccineRequestStatus(
      vaccineRequestId,
      status
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const uploadCertificateToVaccineRequest = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "certificate image is required" });
  }

  // Upload image to Cloudinary
  const cloudinaryResult = await uploadToCloudinary(
    req.file.buffer,
    req.file.originalname
  );

  const certificateUrl = getImageCloudinaryUrl(cloudinaryResult.public_id);
  console.log("Certificate URL:", certificateUrl);

  if (!certificateUrl) {
    return res
      .status(400)
      .json({ message: "Could not retrieve certificate image optimized URL" });
  }

  const { vaccineRequestId } = req.params;

  try {
    const { statusCode, message, data } =
      await addCertificateToVaccineRequestService(
        vaccineRequestId,
        certificateUrl
      );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};

export const getVaccineCertificate = async (req, res) => {
  const { vaccineRequestId } = req.params;

  try {
    const { statusCode, message, data } = await getVaccineCertificateService(
      vaccineRequestId
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  }
};
