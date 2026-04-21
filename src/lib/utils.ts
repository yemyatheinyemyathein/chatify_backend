import jwt from "jsonwebtoken";
import "dotenv/config";
import { Response } from "express";
import { ENV } from "./ENV";

export const generateToken = (userId: any, res: Response): string => {

    const { JWT_SECRET } = ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }  

    const token = jwt.sign({ userId }, JWT_SECRET as string, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: "strict",
        secure: ENV.NODE_ENV === "development" ? false : true,
    });

    return token;
};