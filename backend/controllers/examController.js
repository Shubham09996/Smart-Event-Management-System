const asyncHandler = require('express-async-handler');
const Exam = require('../models/examModel');
const User = require('../models/userModel');

// @desc    Create a new Exam
// @route   POST /api/exams
// @access  Private/Organizer
const createExam = asyncHandler(async (req, res) => {
  const { subjectName, courseCode, date, startTime, endTime, room, syllabusLink } = req.body;

  const exam = new Exam({
    subjectName,
    courseCode,
    date,
    startTime,
    endTime,
    room,
    syllabusLink,
    organizer: req.user._id,
  });

  const createdExam = await exam.save();
  res.status(201).json(createdExam);
});

// @desc    Get all exams created by logged-in organizer
// @route   GET /api/exams/myexams
// @access  Private/Organizer
const getOrganizerExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ organizer: req.user._id }).sort({ date: 1 });
  res.json(exams);
});

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private/Organizer
const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    if (exam.organizer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this exam');
    }
    await exam.deleteOne();
    res.json({ message: 'Exam removed successfully' });
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

// @desc    Get all exams (Datesheet for students)
// @route   GET /api/exams
// @access  Private/Student
const getAllExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({}).populate('organizer', 'name email').sort({ date: 1 });
  res.json(exams);
});

// @desc    Enroll in an exam
// @route   POST /api/exams/:id/enroll
// @access  Private/Student
const enrollInExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    // Check if user already enrolled
    const alreadyEnrolled = exam.students.find(
      (student) => student.studentId.toString() === req.user._id.toString()
    );

    if (alreadyEnrolled) {
      res.status(400);
      throw new Error('You are already enrolled in this exam');
    }

    exam.students.push({
      studentId: req.user._id,
      status: 'enrolled',
    });

    await exam.save();
    res.status(200).json({ message: 'Enrolled in exam successfully' });
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

// @desc    Get enrolled exams for student
// @route   GET /api/exams/enrolled
// @access  Private/Student
const getEnrolledExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({
    'students.studentId': req.user._id
  }).sort({ date: 1 });
  
  res.json(exams);
});

// @desc    Get populated student roster for an exam
// @route   GET /api/exams/:id/roster
// @access  Private/Organizer
const getExamRoster = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate('students.studentId', 'name email rollNo department');

  if (exam) {
    if (exam.organizer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this exam roster');
    }
    res.json(exam.students);
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

// @desc    Mark attendance manually for an exam
// @route   PUT /api/exams/:id/attendance
// @access  Private/Organizer
const markExamAttendance = asyncHandler(async (req, res) => {
  const { studentId, status } = req.body; // status should be 'attended' or 'enrolled'
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    if (exam.organizer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update attendance');
    }

    const studentRecord = exam.students.find(s => s.studentId.toString() === studentId.toString());
    if (studentRecord) {
      studentRecord.status = status;
      await exam.save();
      res.json({ message: 'Attendance updated successfully' });
    } else {
      res.status(404);
      throw new Error('Student not found in this exam');
    }
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

module.exports = {
  createExam,
  getOrganizerExams,
  deleteExam,
  getAllExams,
  enrollInExam,
  getEnrolledExams,
  getExamRoster,
  markExamAttendance
};
