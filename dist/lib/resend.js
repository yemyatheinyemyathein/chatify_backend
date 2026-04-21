"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.resendClient = void 0;
const resend_1 = require("resend");
require("dotenv/config");
const ENV_ts_1 = require("./ENV.ts");
exports.resendClient = new resend_1.Resend(ENV_ts_1.ENV.RESEND_API_KEY);
exports.sender = {
    email: ENV_ts_1.ENV.EMAIL_FROM,
    name: ENV_ts_1.ENV.EMAIL_FROM_NAME
};
