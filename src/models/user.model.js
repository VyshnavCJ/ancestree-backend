const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const geocoder = require('../utils');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 50
    },
    mobileNumber: {
      type: Number,
      required: [true, 'Please provide Phone number'],
      unique: true,
      minlength: 10,
      maxlength: 13
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    },
    password: {
      type: String,
      required: [true, 'Plz provide password'],
      minlength: 6
    },
    email: {
      type: String,
      requires: [true, 'Plz provide email']
    },
    familyId: {
      type: mongoose.Types.ObjectId,
      ref: 'Family'
    },
    memberId: {
      type: mongoose.Types.ObjectId,
      ref: 'Member'
    }
  },
  { timestamps: true }
);

UserSchema.index({ location: '2dsphere' });
UserSchema.pre('save', async function (next) {
  if (!this.isModified('pinCode')) return;
  const loc = await geocoder.geocode(this.pinCode);

  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude]
  };
  next();
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
