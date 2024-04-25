const User = require('../../models/user.model');
const generateAPIError = require('../../utils/errors');
const { generateOtp, fast2sms } = require('./user.helpers');
const { generateJwt } = require('../../utils');
const Family = require('../../models/family.model');
const { transposter } = require('../../config');
//Find User
module.exports.findUser = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) return false;
  else return true;
};

//Create User
module.exports.createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

//Send OTP
module.exports.sendOTP = async (email) => {
  const otp = generateOtp(4);
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'AncesTree OTP',
    text: `Here is the otp for verification in AncesTree Platform ${otp}`
  };
  await transposter.sendMail(mailOptions);
  return otp;
};

//Verify User
module.exports.verifyUser = async (mobileNumber, password) => {
  let firstTime = true;
  const user = await User.findOne({ mobileNumber: mobileNumber }).select(
    '-location -createdAt -updatedAt -__v'
  );
  let familyId = null;
  if (user) {
    familyId = user.familyId;
    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword)
      throw generateAPIError('Incorrect credentials', 401);
    if (user.familyId) firstTime = false;
  } else throw generateAPIError('User not found', 404);
  return { mobileNumber, firstTime, familyId, user };
};

//Change password
module.exports.changePassword = async (mobileNumber, password) => {
  let user = await User.findOne({ mobileNumber: mobileNumber });
  user.password = password;
  await user.save();
};

//update ref
module.exports.refUpdate = async (mobileNumber, ref) => {
  let user = await User.findOne({ mobileNumber: mobileNumber });
  const family = await Family.findOne({ ref: ref });
  if (family) user.familyId = family._id;
  else throw generateAPIError('no family found', 401);
  await user.save();
  const familyId = user.familyId;
  const userId = user._id;
  return { mobileNumber, userId, familyId };
};
