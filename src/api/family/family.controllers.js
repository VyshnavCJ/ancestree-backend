const { StatusCodes } = require('http-status-codes');
const { generateAPIError } = require('../../utils/errors');
const services = require('./family.services');
const Family = require('../../models/family.model');
const User = require('../../models/user.model');

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
  const image = await services.UploadImage(req.files.image);
  const family = await services.UpdateFamily(req.user.familyId, {
    image: image
  });
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Image uploaded created',
    family: family
  });
};

module.exports.Home = async (req, res) => {
  const family = await Family.findById(req.user.familyId);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Home page',
    home: family
  });
};

module.exports.UpdateFamily = async (req, res) => {
  const family = await services.UpdateFamily(req.user.familyId, req.body);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Family updated',
    home: family
  });
};

module.exports.CreateEvent = async (req, res) => {
  await services.CreateEvent(req.user.familyId, req.body);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Event Created'
  });
};

module.exports.DeleteEvent = async (req, res) => {
  await services.DeleteEvent(req.params.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Event Deleted'
  });
};

module.exports.ViewEvent = async (req, res) => {
  const events = await services.ViewEvent(req.user.familyId, req.params.date);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'View Event',
    events: events.events,
    todayEvents: events.todayEvents
  });
};

module.exports.EventNotification = async (req, res) => {
  const minevents = await services.EventNotification(
    req.user.familyId,
    req.params.date
  );
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Min view Events',
    events: minevents.events,
    todayEvents: minevents.todayEvents
  });
};

module.exports.AlbumSingleAdd = async (req, res) => {
  if (!req.files) {
    throw generateAPIError('No files uploaded', 404);
  }
  await services.UploadFilesAlbum(req.files.image);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Album files added'
  });
};

// module.exports.AlbumView = async (req, res) => {
//   const minevents = await services.EventNotification(
//     req.user.mobileNumber,
//     req.params.date
//   );
//   return res.status(StatusCodes.OK).json({
//     success: true,
//     msg: 'Min view Events',
//     events: minevents.events,
//     todayEvents: minevents.todayEvents
//   });
// };
//
// module.exports.AlbumSingle = async (req, res) => {
//   const minevents = await services.EventNotification(
//     req.user.mobileNumber,
//     req.params.date
//   );
//   return res.status(StatusCodes.OK).json({
//     success: true,
//     msg: 'Min view Events',
//     events: minevents.events,
//     todayEvents: minevents.todayEvents
//   });
// };
