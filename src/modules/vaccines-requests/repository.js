import VaccineRequest from "../../models/vaccineRequestModel.js";
import NurseSlot from "../../models/nurseSlotModel.js";
import { formatMongoDbObjects } from "../../utils/dataFormatting.js";

/**
 * Create and save a new vaccine request in the database
 * @param {Object} vaccineRequestData - vaccine request information
 * @returns {Promise<Object>} Created vaccine request document
 */
export const addNewVaccineRequest = async (vaccineRequestData) => {
  try {
    const vaccineRequest = new VaccineRequest(vaccineRequestData);
    const savedVaccineRequest = await vaccineRequest.save();

    // Convert to plain object and remove unwanted fields
    const formattedVaccineRequest = formatMongoDbObjects(savedVaccineRequest);

    return formattedVaccineRequest;
  } catch (error) {
    console.error("Error inserting vaccine request:", error);
    throw error;
  }
};

/**
 * Get all vaccines requests from the database
 * @returns {Promise<Object>} vaccine requests array
 */
export const getAllVaccineRequests = async () => {
  try {
    const vaccineRequests = await VaccineRequest.find()
      .select("-__v")
      .populate({
        path: "parentId",
        select: "fName lName _id",
        model: "User",
      })
      .populate({
        path: "vaccineId",
        select: "name _id",
      })
      .populate({
        path: "nurseId",
        select: "hospitalName fName lName _id",
        model: "Nurse",
      })
      .populate({
        path: "childId",
        select: "name _id",
      });

    if (!vaccineRequests || vaccineRequests.length === 0) {
      throw new Error("Vaccine requests not found!");
    }

    const formattedVaccineRequests = vaccineRequests.map((vr) => {
      return {
        _id: vr._id,
        status: vr.status,
        vaccinationDate: vr.vaccinationDate,
        governorate: vr.governorate,
        city: vr.city,
        street: vr.street,

        parent: vr.parentId
          ? {
              _id: vr.parentId._id,
              name: `${vr.parentId.fName} ${vr.parentId.lName}`,
            }
          : null,
        vaccine: vr.vaccineId
          ? { _id: vr.vaccineId._id, name: vr.vaccineId.name }
          : null,
        nurse: vr.nurseId
          ? {
              _id: vr.nurseId._id,
              name: `${vr.nurseId.fName} ${vr.nurseId.lName}`,
              hospitalName: vr.nurseId.hospitalName,
            }
          : null,
        child: vr.childId
          ? { _id: vr.childId._id, name: vr.childId.name }
          : null,
      };
    });

    return formattedVaccineRequests;
  } catch (error) {
    console.error("Error fetching vaccine requests", error);
    throw error;
  }
};

export const getUserVaccineRequests = async (userId) => {
  try {
    const vaccineRequests = await VaccineRequest.find({ parentId: userId })
      .select(
        "status vaccinationDate governorate city street nurseId vaccineId childId certificate"
      )
      .populate({
        path: "vaccineId",
        select: "name _id",
      })
      .populate({
        path: "nurseId",
        select: "hospitalName fName lName _id",
        model: "Nurse",
      })
      .populate({
        path: "childId",
        select: "name _id",
      });

    if (!vaccineRequests || vaccineRequests.length === 0) {
      throw new Error(`Vaccine requests for user with id: ${userId} not found`);
    }

    const formattedVaccineRequests = vaccineRequests.map((vr) => {
      return {
        _id: vr._id,
        status: vr.status,
        vaccinationDate: vr.vaccinationDate,
        governorate: vr.governorate,
        city: vr.city,
        street: vr.street,
        certificate: vr.certificate,
        vaccine: vr.vaccineId
          ? { _id: vr.vaccineId._id, name: vr.vaccineId.name }
          : null,
        nurse: vr.nurseId
          ? {
              _id: vr.nurseId._id,
              name: `${vr.nurseId.fName} ${vr.nurseId.lName}`,
              hospitalName: vr.nurseId.hospitalName,
            }
          : null,
        child: vr.childId
          ? { _id: vr.childId._id, name: vr.childId.name }
          : null,
      };
    });

    return formattedVaccineRequests;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeUserVaccineRequest = async (vaccineRequestId) => {
  try {
    const vaccineRequest = await VaccineRequest.findByIdAndDelete(
      vaccineRequestId
    );
    return formatMongoDbObjects(vaccineRequest);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateNurseSlotIsBooked = async (nurseSlotId) => {
  try {
    const nurseSlot = await NurseSlot.findByIdAndUpdate(
      nurseSlotId,
      { isBooked: false },
      { new: true, runValidators: true }
    );

    if (!nurseSlot) {
      throw new Error(`Nurse slot of id: ${nurseSlotId} not found!`);
    }

    return formatMongoDbObjects(nurseSlot);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVaccineRequestStatus = async (vaccineRequestId, status) => {
  try {
    const vaccineRequest = await VaccineRequest.findByIdAndUpdate(
      vaccineRequestId,
      { status },
      { new: true, runValidators: true }
    );

    if (!vaccineRequest) {
      throw new Error(
        `Vaccine request with id: ${vaccineRequestId} not found!`
      );
    }

    return vaccineRequest;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addCertificateToVaccineRequest = async (
  vaccineRequestId,
  certificateUrl
) => {
  try {
    const vaccineRequest = await VaccineRequest.findByIdAndUpdate(
      vaccineRequestId,
      { certificate: certificateUrl },
      { new: true, runValidators: true }
    );

    if (!vaccineRequest) {
      throw new Error(
        `Vaccine request with id: ${vaccineRequestId} not found!`
      );
    }
    if (vaccineRequest.status !== "Delivered") {
      throw new Error(
        `Vaccine request with id: ${vaccineRequestId} is not delivered yet!`
      );
    }

    return formatMongoDbObjects(vaccineRequest);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVaccineCertificate = async (vaccineRequestId) => {
  try {
    const vaccineRequest = await VaccineRequest.findById(vaccineRequestId);
    if (!vaccineRequest) {
      throw new Error(
        `Vaccine request with id: ${vaccineRequestId} not found!`
      );
    }

    if (!vaccineRequest.certificate) {
      throw new Error(
        `Vaccine request with id: ${vaccineRequestId} does not have a certificate!`
      );
    }
    return {
      data: vaccineRequest.certificate,
    };
  } catch (error) {
    console.error(error);
    if (error.message.includes("not found")) {
      throw {
        statusCode: 404,
        message: error.message,
      };
    }
    throw {
      statusCode: 500,
      message: "Error retrieving vaccine certificate",
      error: error.message,
    };
  }
};
