const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
    eventImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1540575861501-7ad05823c9fe?w=800&auto=format&fit=crop&q=60", // Upgraded default image
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      default: 0, // 0 implies unlimited
    },
    mediaUrls: [{
      type: String,
    }],
    socialLinks: {
      website: String,
      instagram: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
