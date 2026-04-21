"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatPartners = exports.sendMessage = exports.getMessageByUserId = exports.getAllContacts = void 0;
const User_ts_1 = __importDefault(require("../models/User.ts"));
const Message_ts_1 = __importDefault(require("../models/Message.ts"));
const cloudinary_ts_1 = __importDefault(require("../lib/cloudinary.ts"));
const socket_ts_1 = require("../lib/socket.ts");
const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredMessages = await User_ts_1.default.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredMessages);
    }
    catch (error) {
        console.log("Error in getAllContacts: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getAllContacts = getAllContacts;
const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;
        const messages = await Message_ts_1.default.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getMessageByUserId = getMessageByUserId;
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User_ts_1.default.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }
        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary_ts_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message_ts_1.default({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        const receiverSocketId = (0, socket_ts_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_ts_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const messages = await Message_ts_1.default.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        });
        const chatPartnerIds = [...new Set(messages.map((msg) => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))];
        const chatPartners = await User_ts_1.default.find({ _id: { $in: chatPartnerIds } }).select("-password");
        res.status(200).json(chatPartners);
    }
    catch (error) {
        console.error("Error in getChatPartners : ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getChatPartners = getChatPartners;
