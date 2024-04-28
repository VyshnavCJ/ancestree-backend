const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 50
    },
    WmobileNumber: {
      type: Number,
      minlength: 10,
      maxlength: 13
    },
    email: {
      type: String
    },
    familyId: {
      type: mongoose.Types.ObjectId,
      ref: 'Family'
    },
    memberId: {
      type: String
    },
    dob: {
      type: Date
    },
    dod: {
      type: Date
    },
    alterMobileNumber: {
      type: Number
    },
    spouse: {
      type: String
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '']
    },
    father: {
      type: String
    },
    mother: {
      type: String
    },
    occupation: {
      type: String
    },
    address: {
      type: String
    },
    birthOrder: {
      type: Number
    },
    gender: {
      type: Number
    },
    noOfChildren: {
      type: Number
    },
    childrenAdd: {
      type: [Number]
    },
    picId:{
        type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', MemberSchema);
