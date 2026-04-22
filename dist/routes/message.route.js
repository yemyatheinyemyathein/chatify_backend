import express from "express";
import { getAllContacts, getMessageByUserId, sendMessage, getChatPartners } from "../controllers/message.controller.ts";
import { protectRoute } from "../middleware/auth.middleware.ts";
const router = express.Router();
router.get("/contacts", protectRoute, getAllContacts);
router.get("/chats", protectRoute, getChatPartners);
router.get("/:id", protectRoute, getMessageByUserId);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
