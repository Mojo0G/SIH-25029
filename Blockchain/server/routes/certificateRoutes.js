const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Add a new certificate
router.post('/add', certificateController.addCertificate);

// Verify if a certificate exists
router.post('/verify', certificateController.verifyCertificate);

// Get certificate details
router.post('/details', certificateController.getCertificateDetails);

module.exports = router;