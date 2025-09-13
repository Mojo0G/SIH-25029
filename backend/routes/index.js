import express from "express";
import authRoutes from "./authRoutes.js";
import graduationRoutes from "./graduationRoutes.js";
import internshipRoutes from "./internshipRoutes.js";
import identityRoutes from "./identityRoutes.js";
import ocrRoutes from "./ocrRoutes.js";
import aiRoutes from "./aiRoutes.js";
import databaseRoutes from "./databaseRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/graduation", graduationRoutes);
router.use("/internships", internshipRoutes);
router.use("/identity", identityRoutes);
router.use("/ocr", ocrRoutes);
router.use("/ai", aiRoutes);
router.use("/database", databaseRoutes);

export default router;
