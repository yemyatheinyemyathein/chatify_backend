"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
exports.getReceiverSocketId = getReceiverSocketId;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_auth_middleware_ts_1 = require("../middleware/socket.auth.middleware.ts");
const ENV_ts_1 = require("./ENV.ts");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [ENV_ts_1.ENV.CLIENT_URL || "http://localhost:5173"],
        credentials: true,
    },
});
exports.io = io;
io.use(socket_auth_middleware_ts_1.socketAuthMiddleware);
const userSocketMap = {};
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
io.on("connection", (socket) => {
    const authSocket = socket;
    console.log("A user connected:", authSocket.user?.fullName);
    const userId = authSocket.userId;
    userSocketMap[userId] = authSocket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    authSocket.on("disconnect", () => {
        console.log("A user disconnected:", authSocket.user?.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
