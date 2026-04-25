const express = require('express');
const router = express.Router();
const {
  createExam,
  getOrganizerExams,
  deleteExam,
  getAllExams,
  enrollInExam,
  getEnrolledExams,
  getExamRoster,
  markExamAttendance
} = require('../controllers/examController');
const { protect, organizer, admin } = require('../middleware/authMiddleware');

// Organizer routes
router.post('/', protect, organizer, createExam);
router.get('/myexams', protect, organizer, getOrganizerExams);
router.delete('/:id', protect, organizer, deleteExam);
router.get('/:id/roster', protect, organizer, getExamRoster);
router.put('/:id/attendance', protect, organizer, markExamAttendance);

// Student routes (Protect means any logged-in user)
router.get('/', protect, getAllExams);
router.get('/enrolled', protect, getEnrolledExams);
router.post('/:id/enroll', protect, enrollInExam);

module.exports = router;
