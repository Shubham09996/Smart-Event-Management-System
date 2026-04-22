const express = require('express');
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getMyEvents, 
  getPendingEvents, 
  approveEvent, 
  rejectEvent,
  getOrganizerStats
} = require('../controllers/eventController');
const { protect, admin, organizer } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, organizer, createEvent);

router.get('/myevents', protect, organizer, getMyEvents);
router.get('/organizer-stats', protect, organizer, getOrganizerStats);
router.get('/pending', protect, admin, getPendingEvents);

router.route('/:id/approve').put(protect, admin, approveEvent);
router.route('/:id/reject').put(protect, admin, rejectEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, organizer, updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router;
