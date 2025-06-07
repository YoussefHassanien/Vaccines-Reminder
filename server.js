import app from "./app.js";
import { connectToDatabase } from "./config/database.js";
import { setupCronJobs, runMaintenanceNow } from "./jobs/cronJobs.js";
import {
  startVaccineReminderJob,
  runVaccineReminderNow,
} from "./jobs/vaccinesRemindersJob.js";

app.listen(process.env.PORT || 4000, async () => {
  try {
    console.log(`Server is listening to PORT: ${process.env.PORT || 4000}`);
    await connectToDatabase();
    setupCronJobs();
    startVaccineReminderJob();
  } catch (error) {
    console.log(
      "Some fucntions are throwing errors but server is running successfully"
    );
  }
});
