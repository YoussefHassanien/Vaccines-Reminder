import app from "./app.js";
import { connectToDatabase } from "./config/database.js";

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is listening to PORT: ${process.env.PORT || 4000}`);
  connectToDatabase();
});
