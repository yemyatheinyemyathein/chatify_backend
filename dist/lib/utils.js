"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const ENV_ts_1 = require("./ENV.ts");
const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV_ts_1.ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d"
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV_ts_1.ENV.NODE_ENV === "development" ? false : true,
    });
    return token;
};
exports.generateToken = generateToken;
