import { insertNewProvider } from "./sevices.js";

export const addProvider = async (req, res) => {
  try {
    const providerData = req.body;

    const { status, message, data, error } = await insertNewProvider(
      providerData
    );
    return res.status(status).json({
      message,
      data,
      error,
    });
  } catch {
    return res.status(500).json({
      message: "Error inserting provider",
      error: error.message,
    });
  }
};
