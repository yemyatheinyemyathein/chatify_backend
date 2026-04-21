"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const emailHandlers_ts_1 = require("../emails/emailHandlers.ts");
const cloudinary_ts_1 = __importDefault(require("../lib/cloudinary.ts"));
const ENV_ts_1 = require("../lib/ENV.ts");
const utils_ts_1 = require("../lib/utils.ts");
const User_ts_1 = __importDefault(require("../models/User.ts"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User_ts_1.default.findOne({ email });
        if (user)
            return res.status(400).json({ message: "Email already exists" });
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = new User_ts_1.default({
            fullName,
            email,
            password: hashedPassword
        });
        if (newUser) {
            const savedUser = await newUser.save();
            (0, utils_ts_1.generateToken)(savedUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
            // send welcome email to user 
            try {
                await (0, emailHandlers_ts_1.sendWelcomeEmail)(savedUser.email, savedUser.fullName, ENV_ts_1.ENV.CLIENT_URL);
            }
            catch (error) {
                console.error("Failed to send welcome email :", error);
            }
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in Signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await User_ts_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials" });
        (0, utils_ts_1.generateToken)(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.error("Error in login controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.login = login;
const logout = async (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic)
            return res.status(400).json({ message: "Profile pic is required" });
        const userId = req.user._id;
        const uploadResponse = await cloudinary_ts_1.default.uploader.upload(profilePic);
        const updatedUser = await User_ts_1.default.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
