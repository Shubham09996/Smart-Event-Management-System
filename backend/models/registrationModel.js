const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registrationCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered',
    },
    attendedAt: {
      type: Date,
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
    },
    feedbackRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedbackComment: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only register once per event
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
