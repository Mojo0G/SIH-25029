import express from "express";
import authRoutes from "./authRoutes.js";
import graduationRoutes from "./graduationRoutes.js";
import internshipRoutes from "./internshipRoutes.js";
import identityRoutes from "./identityRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/graduation", graduationRoutes);
router.use("/internships", internshipRoutes);
router.use("/identity", identityRoutes);

export default router;
