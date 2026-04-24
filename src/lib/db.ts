import mongoose from "mongoose";
import { ENV } from "./ENV.js";

export const connectDB = async () => {
    try {
        if (!ENV.MONGO_URI) {
            throw new Error("MONGO_URI is missing from ENV configuration.");
        }

        // Use the validated ENV object
        const conn = await mongoose.connect(ENV.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Don't wait 30s to fail
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error("❌ MongoDB Connection Error:");
        console.error(`Code: ${error.code}`);
        console.error(`Message: ${error.message}`);
        process.exit(1);
    }
}