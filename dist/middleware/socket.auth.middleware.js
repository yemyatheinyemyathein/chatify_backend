"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_ts_1 = __importDefault(require("../models/User.ts"));
const ENV_ts_1 = require("../lib/ENV.ts");
const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token provided."));
        }
        const decoded = jsonwebtoken_1.default.verify(token, ENV_ts_1.ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next();
        }
        const user = await User_ts_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket authenticated for users: ${user.fullName} (${user._id})`);
        next();
    }
    catch (error) {
        console.log("Error in socket authentication: ", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
