const { StatusCodes } = require('http-status-codes');
const generateAPIError = require('../../utils/errors');
const services = require('./user.services');
const { generateJwt } = require('../../utils');
const User = require('../../models/user.model');

module.exports.Register = async (req, res) => {
  const isPresent = await services.findUser(req.body.mobileNumber);
  if (isPresent) throw generateAPIError('User exists', 404);
  const otp = await services.sendOTP(req.body.mobileNumber);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'OTP sended',
    otp: otp
  });
};

module.exports.Forgot = async (req, res) => {
  const isPresent = await services.findUser(req.body.mobileNumber);
  if (!isPresent) throw generateAPIError('User not exist', 404);
  const otp = await services.sendOTP(req.body.mobileNumber);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'OTP sended',
    otp: otp
  });
};
module.exports.CreateUser = async (req, res) => {
  await services.createUser(req.body);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'user created'
  });
};

module.exports.Login = async (req, res) => {
  const mobileNumber = req.body.mobileNumber;
  const password = req.body.password;
  const user = await services.verifyUser(mobileNumber, password);
  const token = generateJwt({ user }, process.env.JWT_LIFETIME);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'logged in',
    token: token,
    firstTime: user.firstTime
  });
};

module.exports.ChangePassword = async (req, res) => {
  await services.changePassword(req.body.mobileNumber, req.body.password);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'password changed'
  });
};

module.exports.UpdateProfile = async (req, res) => {
  const user = await services.UpdateProfile(req.user.mobileNumber, req.body);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'profile updated',
    user: user
  });
};

module.exports.UpdateRef = async (req, res) => {
  const user = await services.refUpdate(req.user.mobileNumber, req.body.ref);
  const token = generateJwt({ user }, process.env.JWT_LIFETIME);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'profile updated',
    user: user,
    token: token
  });
};

module.exports.View = async (req, res) => {
  const user = await User.findOne({
    mobileNumber: req.user.mobileNumber
  }).select('-password');
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'profile updated',
    user: user
  });
};
