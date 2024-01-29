const User = require('./user.model');
const generateAPIError = require('../../utils/errors');
const { generateOtp, fast2sms } = require('./user.helpers');
const { generateJwt } = require('../../utils');

//Find User
module.exports.findUser = async (mobileNumber) => {
  const user = await User.findOne({ mobileNumber: mobileNumber });
  if (!user) return false;
  else return true;
};

//Create User
module.exports.createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

//Send OTP
module.exports.sendOTP = async (mobileNumber) => {
  const otp = generateOtp(4);
  fast2sms(otp, mobileNumber);
  return otp;
};

//Verify User
module.exports.verifyUser = async (mobileNumber, password) => {
  let firstTime = true;
  const user = await User.findOne({ mobileNumber: mobileNumber }).select(
    '-location -createdAt -updatedAt -__v'
  );
  if (user) {
    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword)
      throw generateAPIError('Incorrect credentials', 401);
    if (user.familyId) firstTime = false;
  } else throw generateAPIError('User not found', 404);
  return { ...user.mobileNumber, firstTime };
};

//Change password
module.exports.changePassword = async (mobileNumber, password) => {
  let user = await User.findOne({ mobileNumber: mobileNumber });
  console.log(user);
  user.password = password;
  await user.save();
};
