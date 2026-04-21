"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ENV_ts_1 = require("./ENV.ts");
const connectDB = async () => {
    try {
        const { MONGO_URI } = ENV_ts_1.ENV;
        if (!MONGO_URI)
            throw new Error("MONGO URI is not set");
        const connn = await mongoose_1.default.connect(process.env.MONGO_URI || "");
        console.log("MONGODB Connected:", connn.connection.host);
    }
    catch (error) {
        console.log("Error connection to MongoDB: ", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
