import cron from "node-cron";
import { vaccineReminder } from "../src/modules/vaccines-reminders/services.js";

/**
 * Vaccine Reminder Cron Job
 * Runs every day at 12:00 AM (midnight) to send vaccination reminders
 * Cron expression: "0 0 * * *"
 * - 0: minute (0 = at the top of the hour)
 * - 0: hour (0 = midnight)
 * - *: day of month (any day)
 * - *: month (any month)
 * - *: day of week (any day of week)
 */
export const startVaccineReminderJob = () => {
  // Schedule the job to run every day at midnight (12:00 AM)
  const job = cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const result = await vaccineReminder();

        console.log(
          `✅ [${new Date().toISOString()}] Vaccine reminder job completed successfully`
        );

        if (result.errors.length > 0) {
          console.warn(
            `${result.errors.length} errors occurred during reminder sending:`,
            result.errors
          );
        }
      } catch (error) {
        console.error(
          `❌ [${new Date().toISOString()}] Error in vaccine reminder job:`,
          error
        );
      }
    },
    {
      timezone: "Africa/Cairo",
    }
  );

  console.log(
    "⏳ Vaccine reminder cron job scheduled to run daily at 12:00 AM UTC"
  );
  return job;
};

/**
 * Start the vaccine reminder job immediately (for testing purposes)
 * This function can be called manually to test the reminder system
 */
export const runVaccineReminderNow = async () => {
  try {
    const result = await vaccineReminder();

    console.log(
      `✅ [${new Date().toISOString()}] Manual vaccine reminder job completed`
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [${new Date().toISOString()}] Error in manual vaccine reminder job:`,
      error
    );
    throw error;
  }
};
