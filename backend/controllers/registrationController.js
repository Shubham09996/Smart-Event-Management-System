const asyncHandler = require('express-async-handler');
const Registration = require('../models/registrationModel');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const crypto = require('crypto');
const { parse } = require('json2csv'); // Useful for exporting reports
const { sendEmail } = require('../utils/notifications');

// @desc    Register student for an event
// @route   POST /api/registrations/:eventId
// @access  Private/Student
const registerEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  if (event.capacity > 0) {
    const existingCount = await Registration.countDocuments({ eventId: event._id });
    if (existingCount >= event.capacity) {
      res.status(400);
      throw new Error('Event is at full capacity');
    }
  }

  const alreadyRegistered = await Registration.findOne({ userId: req.user._id, eventId: event._id });
  if (alreadyRegistered) {
    res.status(400);
    throw new Error('Already registered for this event');
  }

  // Generate a random unique alphanumeric code
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const registrationCode = `${event._id.toString().substring(0, 4)}-${req.user._id.toString().substring(0, 4)}-${code}`;

  const registration = await Registration.create({
    userId: req.user._id,
    eventId: event._id,
    registrationCode,
    status: 'registered'
  });

  // Backward compatibility: add to user's registeredEvents array
  const user = await User.findById(req.user._id);
  // cleanup nulls just in case
  user.registeredEvents = user.registeredEvents.filter(e => e && e.eventId && e.registrationCode);
  user.registeredEvents.push({
    eventId: event._id,
    registrationCode
  });
  await user.save({ validateModifiedOnly: true });

  // Send Registration Confirmation Email (non-blocking)
  sendEmail({
    to: req.user.email,
    subject: `Registration Confirmed: ${event.title}`,
    text: `Hello ${req.user.name},\n\nYou have successfully registered for the event "${event.title}".\nYour Registration Code is: ${registrationCode}\nKeep this code safe and show it at the venue for attendance.\n\nBest regards,\nSmart College Events Team`,
    html: `<h3>Hello ${req.user.name},</h3><p>You have successfully registered for the event "<strong>${event.title}</strong>".</p><p>Your Registration Code is: <strong>${registrationCode}</strong></p><p>Keep this code safe and show it at the venue for attendance.</p><br/><p>Best regards,<br/>Smart College Events Team</p>`
  });

  res.status(201).json({ message: 'Event registered successfully', registration, registrationCode });
});

// @desc    Verify QR Code / Mark Attendance
// @route   POST /api/registrations/verify
// @access  Private/Organizer, Admin
const verifyQRCode = asyncHandler(async (req, res) => {
  const { qrCode } = req.body;
  if (!qrCode) {
    res.status(400);
    throw new Error('QR code is required');
  }

  const registration = await Registration.findOne({ registrationCode: qrCode }).populate('userId', 'name email rollNo');
  
  if (!registration) {
    res.status(404);
    throw new Error('Invalid QR Code, registration not found');
  }

  if (registration.status === 'attended') {
    res.status(400);
    throw new Error('Attendance already marked for this user');
  }

  const event = await Event.findById(registration.eventId);
  
  // Organizer can only scan for their own event, Admin can scan for any
  if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to verify attendance for this event');
  }

  registration.status = 'attended';
  registration.attendedAt = new Date();
  await registration.save();

  res.status(200).json({
    message: 'Attendance verified successfully',
    attendee: {
      name: registration.userId.name,
      email: registration.userId.email,
      rollNo: registration.userId.rollNo
    }
  });
});

// @desc    Get QR Code for a registered event
// @route   GET /api/registrations/:eventId/qr
// @access  Private/Student
const getEventQRCode = asyncHandler(async (req, res) => {
  const registration = await Registration.findOne({ userId: req.user._id, eventId: req.params.eventId });
  if (!registration) {
    res.status(404);
    throw new Error('Not registered for this event');
  }
  res.json({ qrCode: registration.registrationCode });
});

// @desc    Get registered users for an event (for Organizer/Admin report)
// @route   GET /api/registrations/:eventId/report
// @access  Private/Organizer, Admin
const getEventRegistrationReport = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this report');
  }

  const registrations = await Registration.find({ eventId: req.params.eventId })
    .populate('userId', 'name email rollNo department')
    .sort('-createdAt');

  res.json(registrations);
});

// @desc    Export registration report to CSV
// @route   GET /api/registrations/:eventId/export
// @access  Private/Organizer, Admin
const exportRegistrationCSV = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const registrations = await Registration.find({ eventId: req.params.eventId }).populate('userId', 'name email rollNo department');
  
  const csvData = registrations.map(reg => ({
    Name: reg.userId.name,
    Email: reg.userId.email,
    RollNo: reg.userId.rollNo || 'N/A',
    Department: reg.userId.department || 'N/A',
    Status: reg.status,
    RegisteredAt: reg.createdAt.toISOString(),
    AttendedAt: reg.attendedAt ? reg.attendedAt.toISOString() : 'N/A'
  }));

  const csv = parse(csvData);
  res.header('Content-Type', 'text/csv');
  res.attachment(`${event.title.replace(/\s+/g, '_')}_Registrations.csv`);
  res.send(csv);
});

// @desc    Submit Feedback for an attended event
// @route   POST /api/registrations/:eventId/feedback
// @access  Private/Student
const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) {
    res.status(400);
    throw new Error('Rating is required');
  }

  const registration = await Registration.findOne({ userId: req.user._id, eventId: req.params.eventId });
  
  if (!registration) {
    res.status(404);
    throw new Error('No registration found for this event');
  }
  
  if (registration.status !== 'attended') {
    res.status(400);
    throw new Error('You must attend the event to submit feedback');
  }

  registration.feedbackRating = rating;
  registration.feedbackComment = comment || '';
  await registration.save();
  
  res.status(200).json({ message: 'Feedback submitted successfully', registration });
});

module.exports = {
  registerEvent,
  verifyQRCode,
  getEventQRCode,
  getEventRegistrationReport,
  exportRegistrationCSV,
  submitFeedback
};
