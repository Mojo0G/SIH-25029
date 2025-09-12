import axios from "axios";
import { PY_API_URL } from "../config/constants.js";
import VerifiedDb from "../models/VerifiedDatabase.js";
import UsableDb from "../models/UsableDatabase.js";

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateType = "Graduation" } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No certificate file uploaded",
        data: null
      });
    }

    // Prepare form data for OCR service
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call OCR service
    const ocrResponse = await axios.post(
      `${PY_API_URL}/verify`,
      formData,
      {
        params: { certificate_type: certificateType },
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    const ocrData = ocrResponse.data;

    if (!ocrData.success) {
      return res.status(400).json({
        success: false,
        message: "Certificate verification failed",
        data: {
          error: ocrData.error,
          verification_status: ocrData.verification_status
        }
      });
    }

    // Check if reference ID exists in verified database
    let verifiedRecord = null;
    if (ocrData.reference_id) {
      verifiedRecord = await VerifiedDb.findOne({ refid: ocrData.reference_id });
    }

    // Prepare response data
    const responseData = {
      verification_status: ocrData.verification_status,
      reference_id: ocrData.reference_id,
      certificate_type: ocrData.certificate_type,
      is_verified: ocrData.summary.is_verified,
      has_reference_id: ocrData.summary.has_reference_id,
      logo_present: ocrData.summary.logo_present,
      tampering_detected: ocrData.summary.tampering_detected,
      overall_confidence: ocrData.summary.overall_confidence,
      ocr_results: ocrData.ocr,
      ai_verification: ocrData.ai_verification,
      database_verification: {
        found_in_verified_db: !!verifiedRecord,
        verified_record: verifiedRecord
      }
    };

    // If verified in database, add to usable database
    if (verifiedRecord && ocrData.summary.is_verified) {
      try {
        const usableRecord = new UsableDb({
          id: Date.now(), // Simple ID generation
          institute: ocrData.ocr.fields["Institution/Company"] || "Unknown",
          type: certificateType,
          year: ocrData.ocr.fields["Year"] || new Date().getFullYear(),
          attachments: {
            original_file: req.file.originalname,
            file_size: req.file.size,
            file_type: req.file.mimetype
          },
          content: ocrData.ocr.fields,
          verifiedStatus: true
        });

        await usableRecord.save();
        responseData.database_verification.added_to_usable_db = true;
      } catch (dbError) {
        console.error("Error adding to usable database:", dbError);
        responseData.database_verification.added_to_usable_db = false;
        responseData.database_verification.db_error = dbError.message;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Certificate verification completed",
      data: responseData
    });

  } catch (error) {
    console.error("Certificate verification error:", error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "OCR service is not available",
        data: null
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: "OCR service error",
        data: {
          error: error.response.data,
          status: error.response.status
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: {
        error: error.message
      }
    });
  }
};

export const getVerificationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, verified } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (verified !== undefined) query.verifiedStatus = verified === 'true';

    const skip = (page - 1) * limit;
    
    const records = await UsableDb.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await UsableDb.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Verification history retrieved",
      data: {
        records,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_records: total,
          records_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error("Get verification history error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: {
        error: error.message
      }
    });
  }
};
