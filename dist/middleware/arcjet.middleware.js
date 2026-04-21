"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arcjetProtection = void 0;
const arcjet_ts_1 = __importDefault(require("../lib/arcjet.ts"));
const inspect_1 = require("@arcjet/inspect");
const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await arcjet_ts_1.default.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res
                    .status(429)
                    .json({ message: "Rate limit exceeded. Please try again later." });
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Bot access denied" });
            }
            else {
                return res.status(403).json({
                    message: "Access denied by security policy.",
                });
            }
        }
        if (decision.results.some(inspect_1.isSpoofedBot)) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected."
            });
        }
    }
    catch (error) {
        console.log("Arcjet Protection Error: ", error);
        next();
    }
};
exports.arcjetProtection = arcjetProtection;
