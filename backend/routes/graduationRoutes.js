import express from "express";
import { getAll, getById, create, updateById, deleteById } from "../controllers/graduationController.js";
import authMiddleware from "../middleware/auth.js";
import { JWT_SECRET } from "../config/constants.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authMiddleware(JWT_SECRET), create);
router.put("/:id", authMiddleware(JWT_SECRET), updateById);
router.delete("/:id", authMiddleware(JWT_SECRET), deleteById);

export default router;
