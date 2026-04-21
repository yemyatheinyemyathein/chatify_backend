import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.ts";
import { protectRoute } from "../middleware/auth.middleware.ts";
import { arcjetProtection } from "../middleware/arcjet.middleware.ts";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute, updateProfile);
router.get("/check", protectRoute, (req:any, res) => res.status(200).json(req.user));

export default router;