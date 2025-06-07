import { getAllUsersChildren, getAllVaccines } from "./repository.js";
import twilio from "twilio";

/**
 * Sends a vaccination reminder to the user's phone via Twilio WhatsApp
 * @param {Object} user - The user object containing user information
 * @param {string} user.name - The user's full name
 * @param {string} user.phoneNumber - The user's phone number (with country code)
 * @param {Object} child - The child object containing child information
 * @param {string} child.name - The child's name
 * @param {Object} vaccine - The vaccine object containing vaccine information
 * @param {string} vaccine.name - The vaccine name
 * @param {string} vaccine.description - The vaccine description/what it prevents
 * @param {string} date - The scheduled vaccination date
 * @returns {Promise<void>} Promise that resolves when the reminder is sent successfully
 * @throws {Error} Throws error if Twilio service fails or phone number is invalid
 */
const sendVaccineReminderMessage = async (user, child, vaccine, date) => {
  // Initialize Twilio client
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    await twilioClient.messages.create({
      body: `*Baby-Guard Vaccine Reminder:* Dear *${user.name}* this is a kindly reminder that your child *${child.name}* has to take *${vaccine.name}* vaccine at *${date}*, This vaccine *${vaccine.description}*`,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${user.phoneNumber}`,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Calculates how many days are left for a child to reach the vaccine's required age
 * @param {Date|string} childBirthDate - The child's birth date
 * @param {string} vaccineRequiredAge - The required age from vaccine model
 * @returns {number} - Number of days left (0 if already eligible, negative if overdue)
 * @throws {Error} Throws error if invalid birth date or unknown vaccine age requirement
 */
const getDaysUntilVaccineEligible = (childBirthDate, vaccineRequiredAge) => {
  try {
    // Convert birth date to Date object if it's a string
    const birthDate = new Date(childBirthDate);
    const currentDate = new Date();

    // Validate birth date
    if (isNaN(birthDate.getTime()) || birthDate > currentDate) {
      throw new Error("Invalid birth date provided");
    }

    // Handle special case
    if (vaccineRequiredAge === "No specific age required") {
      return 0; // Child is always eligible
    }

    // Create a new date object to avoid mutating the original birth date
    const targetVaccinationDate = new Date(birthDate);

    // Calculate target vaccination date based on required age
    switch (vaccineRequiredAge) {
      case "24 hours":
        targetVaccinationDate.setDate(targetVaccinationDate.getDate() + 1);
        break;

      case "6 weeks":
        targetVaccinationDate.setDate(targetVaccinationDate.getDate() + 6 * 7); // 42 days
        break;

      case "10 weeks":
        targetVaccinationDate.setDate(targetVaccinationDate.getDate() + 10 * 7); // 70 days
        break;

      case "14 weeks":
        targetVaccinationDate.setDate(targetVaccinationDate.getDate() + 14 * 7); // 98 days
        break;

      case "2 months":
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 2);
        break;

      case "3 months":
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 3);
        break;

      case "4 months":
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 4);
        break;

      case "6 months":
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 6);
        break;

      case "8 months":
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 8);
        break;

      case "9 months":
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 9);
        break;

      case "1 year":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 1
        );
        break;

      case "1 year and 3 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 1
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 3);
        break;

      case "1 year and 6 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 1
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 6);
        break;

      case "1 year and 9 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 1
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 9);
        break;

      case "2 years":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 2
        );
        break;

      case "2 years and 3 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 2
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 3);
        break;

      case "2 years and 6 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 2
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 6);
        break;

      case "2 years and 9 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 2
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 9);
        break;

      case "3 years":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 3
        );
        break;

      case "3 years and 3 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 3
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 3);
        break;

      case "3 years and 6 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 3
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 6);
        break;

      case "3 years and 9 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 3
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 9);
        break;

      case "4 years":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 4
        );
        break;

      case "9 years":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 9
        );
        break;

      case "9 years and 3 months":
        targetVaccinationDate.setFullYear(
          targetVaccinationDate.getFullYear() + 9
        );
        targetVaccinationDate.setMonth(targetVaccinationDate.getMonth() + 3);
        break;

      default:
        throw new Error(`Unknown vaccine required age: ${vaccineRequiredAge}`);
    }

    // Calculate the difference in days
    const timeDifference =
      targetVaccinationDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
  } catch (error) {
    console.error("Error calculating days until vaccine eligible:", error);
    throw error;
  }
};

/**
 * Sends vaccination reminders to users via WhatsApp for children due for vaccines
 * Sends reminders at 10 days, 3 days, and 1 day before vaccination due date
 * @returns {Promise<Object>} Summary of reminders sent
 * @throws {Error} Throws error if reminder service fails
 */
export const vaccineReminder = async () => {
  try {
    const vaccines = await getAllVaccines();
    const users = await getAllUsersChildren();

    // Initialize response object
    const remindersSent = {
      total: 0,
      byType: { tenDays: 0, threeDays: 0, oneDay: 0 },
      errors: [],
    };

    // Check if data exists
    if (!vaccines || vaccines.length === 0) {
      console.warn("No vaccines found in database");
      return remindersSent;
    }

    if (!users || users.length === 0) {
      console.warn("No users with children found in database");
      return remindersSent;
    }

    console.log(
      `Processing ${users.length} users with children and ${vaccines.length} vaccines`
    );

    // Use for...of loops to properly handle async operations
    for (const user of users) {
      // Add safety check for user structure
      if (
        !user.user ||
        !user.user.children ||
        !Array.isArray(user.user.children)
      ) {
        console.warn(
          `Invalid user structure for user ID: ${user.user?.id || "unknown"}`
        );
        continue;
      }

      for (const child of user.user.children) {
        // Add safety check for child structure
        if (!child || !child.name || !child.birthDate) {
          console.warn(
            `Invalid child structure in user ${user.user.name}'s children`
          );
          continue;
        }

        for (const vaccine of vaccines) {
          try {
            const daysDifference = getDaysUntilVaccineEligible(
              child.birthDate,
              vaccine.requiredAge
            );

            let reminderType = null;
            let targetDate = null;

            if (daysDifference === 10) {
              reminderType = "tenDays";
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + daysDifference);
            } else if (daysDifference === 3) {
              reminderType = "threeDays";
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + daysDifference);
            } else if (daysDifference === 1) {
              reminderType = "oneDay";
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + daysDifference);
            }

            if (reminderType && targetDate) {
              // Format date properly
              const formattedDate = targetDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              await sendVaccineReminderMessage(
                user.user,
                child,
                vaccine,
                formattedDate
              );

              remindersSent.total++;
              remindersSent.byType[reminderType]++;

              console.log(
                `Reminder sent to ${user.user.name} for child ${child.name} - ${vaccine.name} vaccine (${reminderType})`
              );
            }
          } catch (error) {
            console.error(
              `Error sending reminder for ${child.name} - ${vaccine.name}:`,
              error
            );
            remindersSent.errors.push({
              user: user.user.name,
              child: child.name,
              vaccine: vaccine.name,
              error: error.message,
            });
          }
        }
      }
    }

    console.log(
      `Vaccine reminders completed. Total sent: ${remindersSent.total}`
    );
    return remindersSent;
  } catch (error) {
    console.error("Error in vaccine reminder service:", error);
    throw error;
  }
};
