const blockchainService = require('../config/blockchain');

class CertificateController {
  async addCertificate(req, res, next) {
    try {
      const { studentName, institutionName, registrationNumber, course, cgpa } = req.body;

      // Validate input
      if (!studentName || !institutionName || !registrationNumber || !course || !cgpa) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required: studentName, institutionName, registrationNumber, course, cgpa'
        });
      }

      const result = await blockchainService.addCertificate(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Certificate added successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyCertificate(req, res, next) {
    try {
      const { studentName, institutionName, registrationNumber, course, cgpa } = req.body;

      // Validate input
      if (!studentName || !institutionName || !registrationNumber || !course || !cgpa) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required: studentName, institutionName, registrationNumber, course, cgpa'
        });
      }

      const result = await blockchainService.verifyCertificate(req.body);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getCertificateDetails(req, res, next) {
    try {
      const { studentName, institutionName, registrationNumber, course, cgpa } = req.body;

      // Validate input
      if (!studentName || !institutionName || !registrationNumber || !course || !cgpa) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required: studentName, institutionName, registrationNumber, course, cgpa'
        });
      }

      const result = await blockchainService.getCertificateDetails(req.body);
      
      if (!result.exists) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CertificateController();