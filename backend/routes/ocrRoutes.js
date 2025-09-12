import express from "express";
import { extractOcr, getOcrResult } from "../controllers/ocrController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { CERTIFICATES_DIR } from "../config/constants.js";

const router = express.Router();

const uploadsDir = CERTIFICATES_DIR;
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/extract", upload.single("file"), extractOcr);
router.post("/extract-all", async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
    const results = [];
    for (const f of files) {
      req.file = { path: path.join(uploadsDir, f), originalname: f };
      const { OcrService } = await import("../services/ocrService.js");
      const r = await OcrService.extract(req.file.path, req.file.originalname);
      results.push({ file: f, result: r });
    }
    return res.status(200).json({ success: true, count: results.length, results });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});
router.get("/:id", getOcrResult);

export default router;


