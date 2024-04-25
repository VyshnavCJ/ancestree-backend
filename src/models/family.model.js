const mongoose = require('mongoose');

const FamilyScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 50
    },
    ref: {
      type: String,
      requires: true
    },
    history: {
      type: String
    },
    albumid: {
      type: [{ name: String, id: String }]
    },
    image: {
      type: String,
      default: ''
    },
    treeFile: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Family', FamilyScheme);
