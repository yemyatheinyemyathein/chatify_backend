import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/ENV.js";
import express from 'express';

// Define the interface to extend the standard Express Request
interface AuthenticatedRequest extends express.Request {
    user?: any;
}

export const protectRoute = async (
    req: AuthenticatedRequest, // Changed from express.Request to AuthenticatedRequest
    res: express.Response,
    next: express.NextFunction // Using the standard Express NextFunction type
) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as any;
        
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectedRoute middleware : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};