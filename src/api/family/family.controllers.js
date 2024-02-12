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

module.exports.Upload = async (req, res) => {
  if (!req.files) {
    throw generateAPIError('No files uploaded', 404);
  }
  console.log(req);
  const image = await services.UploadImage(req.files.image);
  const family = await services.UpdateFamily(req.user.mobileNumber, {
    image: image
  });
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Image uploaded created',
    family: family
  });
};
