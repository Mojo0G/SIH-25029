import express from "express";
import multer from "multer";
import { verifyCertificate, getVerificationHistory } from "../controllers/certificateController.js";
import authMiddleware from "../middleware/auth.js";
import { JWT_SECRET } from "../config/constants.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Protected routes - require authentication
router.use(authMiddleware(JWT_SECRET));

// Certificate verification endpoint
router.post("/verify", upload.single('certificate'), verifyCertificate);

// Get verification history
router.get("/history", getVerificationHistory);

export default router;
