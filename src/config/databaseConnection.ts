import mongoose from "mongoose";
import type { promises } from "node:dns";

export const connectDB = async () => {
  try {
    const mongooseURI = process.env.MONGODB_URI;

    if (!mongooseURI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    const data = await mongoose.connect(mongooseURI);

    console.log(`Database conneted to ${data.connection.host}`);
  } catch (error) {
    console.log(`Database connection failed ${error}`);
  }
};
