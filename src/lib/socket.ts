import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import { ENV } from "./ENV.js";

interface UserPayload {
  _id: string;
  fullName: string;
  email: string;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
  user: UserPayload;
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://chatify-xi-seven.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true 
});

io.use(socketAuthMiddleware);

const userSocketMap: Record<string, string> = {};

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const authSocket = socket as AuthenticatedSocket;

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

export { io, app, server };