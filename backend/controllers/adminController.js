const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Category = require('../models/categoryModel');
const Registration = require('../models/registrationModel');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalEvents = await Event.countDocuments();
  const totalCategories = await Category.countDocuments();
  const pendingEvents = await Event.countDocuments({ isApproved: false });
  const approvedEvents = await Event.countDocuments({ isApproved: true });
  const totalRegistrations = await Registration.countDocuments();
  const totalAttendance = await Registration.countDocuments({ status: 'attended' });

  res.json({
    totalUsers,
    totalEvents,
    totalCategories,
    pendingEvents,
    approvedEvents,
    totalRegistrations,
    totalAttendance
  });
});

// @desc    Get Event Count by Category for Charts
// @route   GET /api/admin/event-category-counts
// @access  Private/Admin
const getEventCategoryCounts = asyncHandler(async (req, res) => {
  const categoryCounts = await Event.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, name: '$_id', value: '$count' } },
  ]);

  res.json(categoryCounts);
});

// @desc    Get Event Count by Month for Charts
// @route   GET /api/admin/event-month-counts
// @access  Private/Admin
const getEventMonthCounts = asyncHandler(async (req, res) => {
  const monthCounts = await Event.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, events: { $sum: 1 } } },
    { $sort: { '_id': 1 } },
    { $project: { _id: 0, month: '$_id', events: 1 } },
  ]);

  // Aggregate registrations by month
  const regCounts = await Registration.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, registrations: { $sum: 1 } } }
  ]);

  // Merge the two arrays by month
  const merged = monthCounts.map(m => {
    const r = regCounts.find(rc => rc._id === m.month);
    return { month: m.month, events: m.events, registrations: r ? r.registrations : 0 };
  });

  res.json(merged);
});

module.exports = { getAdminStats, getEventCategoryCounts, getEventMonthCounts };
