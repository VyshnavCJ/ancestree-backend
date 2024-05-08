const { StatusCodes } = require('http-status-codes');
const generateAPIError = require('../../utils/errors');
const services = require('./family.services');
const Family = require('../../models/family.model');
const User = require('../../models/user.model');
const { generateJwt } = require('../../utils');
const { drive } = require('../../utils');
module.exports.CreateFamily = async (req, res) => {
  req.body.ref = req.body.name.slice(0, 6);
  const family = await services.Create(req.body, req.user.mobileNumber);
  const user = {
    mobileNumber: req.user.mobileNumber,
    firstTime: false,
    familyId: family._id
  };

  const token = generateJwt({ user }, process.env.JWT_LIFETIME);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'family created',
    family: family,
    token: token
  });
};

module.exports.Tree = async (req, res) => {
  const family = await Family.findById(req.user.familyId);
  const file = await drive.files.get({
    fileId: family.treeFile,
    alt: 'media'
  });
  const tree = file.data;
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Tree link',
    tree: tree
  });
};
module.exports.TreeMobile = async (req, res) => {
  const user = await User.findById(req.body.userId);
  console.log(user);
  const family = await Family.findById(user.familyId);
  const file = await drive.files.get({
    fileId: family.treeFile,
    alt: 'media'
  });
  const tree = file.data;
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Tree link',
    tree: tree
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
  const length = req.files.files.length;
  if (length)
    for (let f = 0; f < req.files.files.length; f++)
      await services.UploadFilesAlbum(req.files.files[f], req.params.id);
  else await services.UploadFilesAlbum(req.files.files, req.params.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Album files added'
  });
};

module.exports.AlbumCreate = async (req, res) => {
  await services.CreateFolder(req.body.name, req.user.familyId);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Album created'
  });
};

module.exports.AlbumView = async (req, res) => {
  const albums = await services.Albums(req.user.familyId);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Albums',
    albums: albums
  });
};

module.exports.AlbumSingleView = async (req, res) => {
  const albumFiles = await services.AlbumView(req.params.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'files',
    albumsFiles: albumFiles
  });
};
