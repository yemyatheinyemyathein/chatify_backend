"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./lib/db");
const promises_1 = __importDefault(require("node:dns/promises"));
const ENV_1 = require("./lib/ENV");
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./lib/socket");
promises_1.default.setServers(["1.1.1.1"]);
const __dirname = path_1.default.resolve();
const PORT = ENV_1.ENV.PORT || 3000;
socket_1.app.use((0, cors_1.default)({
    origin: ENV_1.ENV.CLIENT_URL,
    credentials: true,
}));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(express_1.default.json({ limit: '5mb' }));
// Increase the limit for URL-encoded data
socket_1.app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
if (ENV_1.ENV.NODE_ENV === "production") {
    socket_1.app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    socket_1.app.get("*", (_, res) => {
        res.sendFile(path_1.default.join(__dirname, "../frontend/dist/index.html"));
    });
}
socket_1.server.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
    (0, db_1.connectDB)();
});
