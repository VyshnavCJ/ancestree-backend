const mongoose = require('mongoose');

const EventScheme = new mongoose.Schema(
  {
    name: {
      type: String
    },
    place: {
      type: String
    },
    details: {
      type: String
    },
    date: {
      type: Date
    },
    familyId: {
      type: mongoose.Types.ObjectId,
      ref: 'Family'
    },
    time: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventScheme);
