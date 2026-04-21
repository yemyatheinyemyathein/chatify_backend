import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";
import { ENV } from "../lib/ENV.ts";

// This allows us to attach user data to the socket object without errors
interface AuthenticatedSocket extends Socket {
    user?: any;
    userId?: string;
}

export const socketAuthMiddleware = async (
    socket: AuthenticatedSocket, 
    next: (err?: Error) => void
) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token provided."));
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET!) as any;
        
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(); 
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated for users: ${user.fullName} (${user._id})`);
        next();
    } catch (error: any) {
        console.log("Error in socket authentication: ", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }    
};