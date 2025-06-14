import Nurse from "../../models/nurseModel.js";
import NurseSlot from "../../models/nurseSlotModel.js";
import vaccineRequest from "../../models/vaccineRequestModel.js";

/**
 * Create slots for a nurse for the next 2 weeks
 * @param {string} nurseId - The nurse's ID
 * @returns {Promise<void>}
 */
const createSlotsForNurse = async (nurseId) => {
  try {
    // Define time slots (9 AM to 5 PM = 8 slots)
    const timeSlots = [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "10:00", endTime: "11:00" },
      { startTime: "11:00", endTime: "12:00" },
      { startTime: "12:00", endTime: "13:00" },
      { startTime: "13:00", endTime: "14:00" },
      { startTime: "14:00", endTime: "15:00" },
      { startTime: "15:00", endTime: "16:00" },
      { startTime: "16:00", endTime: "17:00" },
    ];

    const slots = [];
    const today = new Date();

    // Create slots for the next 14 days
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);

      // Reset time to start of day to avoid timezone issues
      currentDate.setHours(0, 0, 0, 0);

      // Create all 8 time slots for this date
      timeSlots.forEach((timeSlot) => {
        slots.push({
          nurseId,
          date: new Date(currentDate),
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isBooked: false,
        });
      });
    }

    // Insert all slots at once for better performance
    await NurseSlot.insertMany(slots);
    console.log(`✅ Created ${slots.length} slots for nurse ${nurseId}`);
  } catch (error) {
    console.error(`❌ Error creating slots for nurse ${nurseId}:`, error);
    throw error;
  }
};

/**
 * Create and save a new nurse in the database
 * @param {Object} nurseData - Nurse information
 * @param {string} nurseData.fName - Nurse first name
 * @param {string} nurseData.lName - Nurse last name
 * @param {string} nurseData.email - Nurse email
 * @param {string} nurseData.phone - Nurse phone
 * @param {string} nurseData.profileImage - Nurse profileImage URL
 * @param {string} nurseData.hospitalName - Nurse hospitalName
 * @returns {Promise<Object>} Created Nurse document
 */
export const addNewNurse = async (nurseData) => {
  try {
    // Create the nurse
    const nurse = new Nurse(nurseData);
    const savedNurse = await nurse.save();

    // Convert to plain object and remove unwanted fields
    const nurseObj = savedNurse.toObject();
    delete nurseObj.createdAt;
    delete nurseObj.updatedAt;
    delete nurseObj.__v;

    // Create default slots for the new nurse (next 2 weeks)
    await createSlotsForNurse(savedNurse._id);

    return nurseObj;
  } catch (error) {
    console.error("Error inserting nurse:", error);
    throw error;
  }
};

/**
 * Get available slots for a nurse
 * @param {string} nurseId - The nurse's ID
 * @param {Date} startDate - Start date for slot search (optional)
 * @param {number} days - Number of days to search (default: 14)
 * @returns {Promise<Array>} Array of available slots
 */
export const getAvailableSlots = async (
  nurseId,
  startDate = new Date(),
  days = 14
) => {
  try {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);

    const availableSlots = await NurseSlot.find({
      nurseId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      isBooked: false,
    })
      .sort({ date: 1, startTime: 1 })
      .populate("nurseId", "fName lName");

    return availableSlots;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

/**
 * Book a specific slot
 * @param {string} slotId - The slot's ID
 * @returns {Promise<Object>} Updated slot
 */
export const bookSlot = async (slotId, vaccineId, nurseId) => {
  try {
    const slot = await NurseSlot.findOne({ _id: slotId, nurseId });

    if (!slot) {
      throw new Error("Slot not found");
    }

    if (slot.isBooked) {
      throw new Error("Slot is already booked");
    }
    const existingRequest = await vaccineRequest.findById(vaccineId);
    if (!existingRequest) {
      throw new Error("Vaccine request not found");
    }
    if (existingRequest.status !== "Pending") {
      throw new Error("Vaccine request is not in pending status");
    }
    existingRequest.nurseId = slot.nurseId;

    existingRequest.nurseSlotId = slot._id;

    existingRequest.status = "Confirmed";
    await existingRequest.save();

    slot.isBooked = true;

    const updatedSlot = await slot.save();
    return updatedSlot;
  } catch (error) {
    console.error("Error booking slot:", error);
    throw error;
  }
};

/**
 * Cancel a booked slot
 * @param {string} slotId - The slot's ID
 * @returns {Promise<Object>} Updated slot
 */
export const cancelSlot = async (slotId) => {
  try {
    const slot = await NurseSlot.findById(slotId);

    if (!slot) {
      throw new Error("Slot not found");
    }

    if (!slot.isBooked) {
      throw new Error("Slot is not booked");
    }

    slot.isBooked = false;

    const updatedSlot = await slot.save();
    return updatedSlot;
  } catch (error) {
    console.error("Error cancelling slot:", error);
    throw error;
  }
};

/**
 * Get all slots for a nurse (booked and available)
 * @param {string} nurseId - The nurse's ID
 * @param {Date} startDate - Start date for slot search (optional)
 * @param {number} days - Number of days to search (default: 14)
 * @returns {Promise<Array>} Array of all slots
 */
export const getNurseSlots = async (
  nurseId,
  startDate = new Date(),
  days = 14
) => {
  try {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);

    const slots = await NurseSlot.find({
      nurseId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ date: 1, startTime: 1 })
      .populate("nurseId", "fName lName");

    // Group slots by date for easier frontend handling
    const slotsByDate = slots.reduce((acc, slot) => {
      const dateStr = slot.date.toISOString().split("T")[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(slot);
      return acc;
    }, {});

    return slotsByDate;
  } catch (error) {
    console.error("Error fetching nurse slots:", error);
    throw error;
  }
};

/**
 * Maintain slots - ensure each nurse has slots for the next 2 weeks
 * This function should be called daily via cron job
 * @returns {Promise<void>}
 */
export const maintainSlots = async () => {
  try {
    console.log("🔄 Starting slot maintenance...");

    // Get all nurses
    const nurses = await Nurse.find({});

    for (const nurse of nurses) {
      // Set dates properly for consistent comparisons
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const twoWeeksFromToday = new Date(today);
      twoWeeksFromToday.setDate(today.getDate() + 14);
      twoWeeksFromToday.setHours(0, 0, 0, 0); // Start of the 15th day

      // Count ALL slots (booked and unbooked)
      const existingSlots = await NurseSlot.countDocuments({
        nurseId: nurse._id,
        date: {
          $gte: today,
          $lt: twoWeeksFromToday,
        },
      });

      // Each nurse should have 8 slots per day × 14 days = 112 slots
      const expectedSlots = 8 * 14;

      if (existingSlots < expectedSlots) {
        const completionPercentage = Math.round(
          (existingSlots / expectedSlots) * 100
        );
        console.log(
          `🔧 Nurse ${nurse.fName} ${nurse.lName}: ${nurse._id} has ${existingSlots}/${expectedSlots} slots (${completionPercentage}%). Creating missing slots...`
        );
        await createMissingSlots(nurse._id, today, twoWeeksFromToday);
      } else {
        console.log(
          `✅ Nurse ${nurse.fName} ${nurse.lName}: ${nurse._id} has sufficient slots (${existingSlots}/${expectedSlots})`
        );
      }
    }

    // Clean up old unbooked slots (past dates)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const deletedSlots = await NurseSlot.deleteMany({
      date: { $lt: startOfToday },
      isBooked: false, // Only delete unbooked slots from the past
    });

    console.log(
      `✅ Slot maintenance completed. Deleted ${deletedSlots.deletedCount} old unbooked slots.`
    );
  } catch (error) {
    console.error("❌ Error in slot maintenance:", error);
  }
};

/**
 * Create missing slots for a nurse in a date range
 * @param {string} nurseId - The nurse's ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<void>}
 */
const createMissingSlots = async (nurseId, startDate, endDate) => {
  try {
    const timeSlots = [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "10:00", endTime: "11:00" },
      { startTime: "11:00", endTime: "12:00" },
      { startTime: "12:00", endTime: "13:00" },
      { startTime: "13:00", endTime: "14:00" },
      { startTime: "14:00", endTime: "15:00" },
      { startTime: "15:00", endTime: "16:00" },
      { startTime: "16:00", endTime: "17:00" },
    ];

    // Get all existing slots for this nurse in the date range
    const existingSlots = await NurseSlot.find({
      nurseId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).select("date startTime endTime");

    // Create a Set of existing slot identifiers for quick lookup
    const existingSlotSet = new Set(
      existingSlots.map(
        (slot) => `${slot.date.toISOString().split("T")[0]}_${slot.startTime}`
      )
    );

    const slots = [];
    const currentDate = new Date(startDate);

    // Iterate through each day in the range
    while (currentDate < endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];

      // Check each time slot for this date
      timeSlots.forEach((timeSlot) => {
        const slotIdentifier = `${dateStr}_${timeSlot.startTime}`;

        // If this specific slot doesn't exist, add it to be created
        if (!existingSlotSet.has(slotIdentifier)) {
          slots.push({
            nurseId,
            date: new Date(currentDate), // Create new Date object to avoid mutation
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            isBooked: false,
          });
        }
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (slots.length > 0) {
      await NurseSlot.insertMany(slots);
      console.log(
        `✅ Created ${slots.length} missing slots for nurse ${nurseId}`
      );
    } else {
      console.log(`ℹ️ No missing slots found for nurse ${nurseId}`);
    }
  } catch (error) {
    console.error(
      `❌ Error creating missing slots for nurse ${nurseId}:`,
      error
    );
    throw error;
  }
};

/**
 * Get all nurses from the database with pagination
 * @param {number} cursor - ID of the last retrieved nurse
 * @param {number} limit - Number of nurses per page
 * @returns {Promise<Object>} Nurses array and pagination metadata
 */
export const getPaginatedNurses = async (cursor, limit) => {
  try {
    const query = cursor
      ? { _id: { $gt: cursor } } // Fetch nurses with `_id` greater than the cursor
      : {};

    const nurses = await Nurse.find(query)
      .select("-createdAt -updatedAt -__v")
      .sort({ _id: 1 }) // Sort by `_id` in ascending order
      .limit(limit);

    return nurses;
  } catch (error) {
    console.error("Error fetching nurses by cursor:", error);
    throw error;
  }
};
/**
 * Delete a nusre by ID
 * @param {string} id - Nurse ID
 * @returns {Promise<Object>} Deleted nusre document
 */
export const getFreeSlots = async (id) => {
  try {
    const slots = await NurseSlot.find({ nurseId: id, isBooked: false });
    console.log("Free slots for nurse:", slots);

    if (!slots) {
      throw new Error("No free slots found for this nurse");
    }
    const formattedSlots = slots.map((slot) => ({
      _id: slot._id,
      date: slot.date.toISOString().split("T")[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    return formattedSlots;
  } catch (error) {
    console.error(`Error finding slots for Nurse with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a nurse by ID and clean up associated slots
 * @param {string} id - Nurse ID
 * @returns {Promise<Object>} Deleted nurse document and cleanup info
 */
export const deleteNurse = async (id) => {
  try {
    // First check if nurse exists
    const nurse = await Nurse.findById(id);

    if (!nurse) {
      throw new Error("Nurse not found");
    }

    // Delete all slots associated with this nurse
    const deletedSlots = await NurseSlot.deleteMany({ nurseId: id });

    // Delete the nurse
    const deletedNurse = await Nurse.findByIdAndDelete(id);

    console.log(
      `✅ Deleted nurse ${id} and ${deletedSlots.deletedCount} associated slots`
    );

    return {
      nurse: deletedNurse,
      deletedSlotsCount: deletedSlots.deletedCount,
    };
  } catch (error) {
    console.error(`Error deleting Nurse with ID ${id}:`, error);
    throw error;
  }
};
