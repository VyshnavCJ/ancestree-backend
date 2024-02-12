const { StatusCodes } = require('http-status-codes');
const generateAPIError = require('../../utils/errors');
const services = require('./family.services');
const { generateJwt } = require('../../utils');
module.exports.CreateFamily = async (req, res) => {
  req.body.ref = req.body.name.slice(0, 6);
  const family = await services.Create(req.body, req.user.mobileNumber);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'family created',
    family: family
  });
};
