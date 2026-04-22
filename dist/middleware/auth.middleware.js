import jwt from "jsonwebtoken";
import User from "../models/User.ts"; // Removed .ts
import { ENV } from "../lib/ENV.ts"; // Removed .ts
export const protectRoute = async (req, // Changed from express.Request to AuthenticatedRequest
res, next // Using the standard Express NextFunction type
) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protectedRoute middleware : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
