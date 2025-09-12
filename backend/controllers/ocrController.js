import { OcrService } from "../services/ocrService.js";

export const extractOcr = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await OcrService.extract(req.file.path, req.file.originalname);
    return res.status(200).json({ success: true, message: "OCR extracted", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOcrResult = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await OcrService.getById(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


