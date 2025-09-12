import express from "express";
import { login, signup, verifyToken, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";
import { JWT_SECRET } from "../config/constants.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/signup", signup);

// Protected routes
router.get("/verify", authMiddleware(JWT_SECRET), verifyToken);
router.post("/logout", authMiddleware(JWT_SECRET), logout);

export default router;
