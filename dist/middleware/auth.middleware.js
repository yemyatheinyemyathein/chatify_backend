"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_ts_1 = __importDefault(require("../models/User.ts"));
const ENV_ts_1 = require("../lib/ENV.ts");
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        const decoded = jsonwebtoken_1.default.verify(token, ENV_ts_1.ENV.JWT_SECRET);
        if (!decoded)
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        const user = await User_ts_1.default.findById(decoded.userId).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protectedRoute middleware : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.protectRoute = protectRoute;
