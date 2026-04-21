import express from "express";
import CookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import path from "path";
import { connectDB } from "./lib/db";
import dns from "node:dns/promises";
import { ENV } from "./lib/ENV";
import cors from "cors";
import { app, server } from "./lib/socket";
dns.setServers(["1.1.1.1"]);

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(CookieParser());
app.use(express.json({ limit: '5mb' }));

// Increase the limit for URL-encoded data
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
  connectDB();
});
