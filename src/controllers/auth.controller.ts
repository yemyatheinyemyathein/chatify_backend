import { Request, Response } from "express";
import { sendWelcomeEmail } from "../emails/emailHandlers";
import cloudinary from "../lib/cloudinary";
import { ENV } from "../lib/ENV";
import { generateToken } from "../lib/utils";
import User from "../models/User";
import bcrypt from "bcryptjs";

// Helper interface to allow req.user
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const signup = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: (newUser as any).profilePic
            });

            // send welcome email to user 
            try {
                await sendWelcomeEmail(savedUser.email as string, savedUser.fullName as string, ENV.CLIENT_URL!)
            } catch (error) {
                console.error("Failed to send welcome email :", error);
            }
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in Signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password as string);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: (user as any).profilePic
        });
    } catch (error) {
        console.error("Error in login controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (_: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
}

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};