const express = require('express');
const router = express.Router();
const { 
  registerEvent, 
  verifyQRCode, 
  getEventQRCode, 
  getEventRegistrationReport, 
  exportRegistrationCSV,
  submitFeedback
} = require('../controllers/registrationController');
const { protect, admin, organizer } = require('../middleware/authMiddleware');

// Student routes
router.post('/:eventId', protect, registerEvent);
router.get('/:eventId/qr', protect, getEventQRCode);
router.post('/:eventId/feedback', protect, submitFeedback);

// Organizer/Admin routes
router.post('/verify', protect, verifyQRCode);
router.get('/:eventId/report', protect, getEventRegistrationReport);
router.get('/:eventId/export', protect, exportRegistrationCSV);

module.exports = router;
