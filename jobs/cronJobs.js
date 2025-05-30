// utils/cronJobs.js
import cron from "node-cron";
import { maintainSlots } from "../src/modules/nurse/repository.js";

/**
 * Setup cron jobs for slot maintenance
 */
export const setupCronJobs = () => {
  // Run daily at 2:00 AM to maintain slots
  cron.schedule(
    "0 2 * * *",
    async () => {
      console.log("🕐 Running daily slot maintenance at 2:00 AM");
      try {
        await maintainSlots();
      } catch (error) {
        console.error("❌ Error in daily slot maintenance:", error);
      }
    },
    {
      timezone: "Africa/Cairo",
    }
  );

  console.log("✅ Cron jobs scheduled successfully");
};

// Alternative: You can also run maintenance every 6 hours
export const setupFrequentMaintenance = () => {
  // Run every 6 hours
  cron.schedule(
    "0 */6 * * *",
    async () => {
      console.log("🕕 Running slot maintenance every 6 hours");
      try {
        await maintainSlots();
      } catch (error) {
        console.error("❌ Error in frequent slot maintenance:", error);
      }
    },
    {
      timezone: "Africa/Cairo",
    }
  );

  console.log("✅ Frequent maintenance cron job scheduled");
};

// Manual trigger for immediate maintenance (useful for testing)
export const runMaintenanceNow = async () => {
  console.log("🔧 Running slot maintenance manually...");
  try {
    await maintainSlots();
    console.log("✅ Manual maintenance completed");
  } catch (error) {
    console.error("❌ Error in manual maintenance:", error);
  }
};
