import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.ts";
import { ENV } from "./ENV.ts";

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
    origin: [ENV.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  },
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