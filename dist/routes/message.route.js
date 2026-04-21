"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_ts_1 = require("../controllers/message.controller.ts");
const auth_middleware_ts_1 = require("../middleware/auth.middleware.ts");
const router = express_1.default.Router();
router.get("/contacts", auth_middleware_ts_1.protectRoute, message_controller_ts_1.getAllContacts);
router.get("/chats", auth_middleware_ts_1.protectRoute, message_controller_ts_1.getChatPartners);
router.get("/:id", auth_middleware_ts_1.protectRoute, message_controller_ts_1.getMessageByUserId);
router.post("/send/:id", auth_middleware_ts_1.protectRoute, message_controller_ts_1.sendMessage);
exports.default = router;
