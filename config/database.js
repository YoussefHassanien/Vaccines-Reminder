import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("Connected to database");
  } catch (err) {
    console.error(`Error connecting to database: ${err.message}`);
    throw err;
  }
};
