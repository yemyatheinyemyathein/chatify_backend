"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const ENV_ts_1 = require("./ENV.ts");
cloudinary_1.v2.config({
    cloud_name: ENV_ts_1.ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV_ts_1.ENV.CLOUDINARY_API_KEY,
    api_secret: ENV_ts_1.ENV.CLOUDINARY_API_SECRET
});
exports.default = cloudinary_1.v2;
