const Family = require('../../models/family.model');
const generateAPIError = require('../../utils/errors');
const User = require('../../models/user.model');
const Event = require('../../models/event.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { drive } = require('../../utils');

module.exports.Create = async (data, mobileNumber) => {
  const family = await Family.create(data);
  await User.updateOne(
    { mobileNumber: mobileNumber },
    { familyId: family._id }
  );
  return family;
};

module.exports.UploadImage = async (productImage) => {
  if (!productImage.mimetype.startsWith('image')) {
    throw new generateAPIError('Plz upload an Image', 404);
  }
  const maxSize = 100000;
  if (productImage.size > maxSize) {
    throw generateAPIError('Plz upload image smaller than 100kb', 404);
  }
  const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
    use_filename: true,
    folder: 'file-upload'
  });
  fs.unlinkSync(productImage.tempFilePath);
  return result.secure_url;
};

module.exports.UpdateFamily = async (id, data) => {
  const family = await Family.findById(id);
  if (data?.image) family.image = data.image;
  else if (data?.history) family.history = data.history;
  else if (data?.name) family.name = data.name;
  await family.save();
  return family;
};

module.exports.CreateEvent = async (id, data) => {
  const family = await Family.findById(id);
  data.familyId = family._id;
  const users = await User.find({ familyId: id });
  console.log(users);
  await Event.create(data);
};

module.exports.DeleteEvent = async (id) => {
  await Event.deleteOne({ _id: id });
};

module.exports.ViewEvent = async (id, date) => {
  const family = await Family.findById(id);
  const todayEvents = await Event.find({
    familyId: family._id,
    date: date
  }).sort({ date: 'asc' });
  const events = await Event.find({ familyId: family._id }).sort({
    date: 'asc'
  });
  return { events, todayEvents };
};

module.exports.EventNotification = async (id, date) => {
  const family = await Family.findById(id);
  const todayEvents = await Event.find({ familyId: family._id, date: date })
    .select('-place -createdAt -updatedAt -familyId -__v')
    .sort({ date: 'asc' });
  const events = await Event.find({ familyId: family._id })
    .select('-place -createdAt -updatedAt -familyId -__v')
    .sort({ date: 'asc' })
    .limit(25);
  return { events, todayEvents };
};

module.exports.UploadFilesAlbum = async (file, albumId) => {
  await drive.files.create({
    media: {
      mimeType: file.mimeType,
      body: fs.createReadStream(file.tempFilePath)
    },
    requestBody: {
      name: file.name,
      parents: [albumId]
    },
    fields: 'id,name'
  });
  fs.unlinkSync(file.tempFilePath);
};

module.exports.CreateFolder = async (name, familyId) => {
  const fileMetadata = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['1TsGsVMt5KwFrdVwQ4mUo4xhluuvuFVWy']
  };
  const file = await drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  });
  const family = await Family.findById(familyId);
  family.albumid.push({ name: name, id: file.data.id });
  await family.save();
};

module.exports.Albums = async (familyId) => {
  const family = await Family.findById(familyId);
  return family.albumid;
};

module.exports.AlbumView = async (albumId) => {
  let files = [];
  const res = await drive.files.list({
    q: `'${albumId}' in parents`,
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive'
  });
  // `https://drive.google.com/file/d/${res.files.id}/view`
  res.data.files.forEach(function (file) {
    files.push(`https://drive.google.com/file/d/${file.id}/view`);
  });
  return files;
};
