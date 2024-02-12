const Family = require('../../models/family.model');
const generateAPIError = require('../../utils/errors');
const { generateJwt } = require('../../utils');
const User = require('../../models/user.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

module.exports.Create = async (data, mobileNumber) => {
  const family = await Family.create(data);
  const user = await User.updateOne(
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
    throw new generateAPIError('Plz upload image smaller than 100kb', 404);
  }
  const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
    use_filename: true,
    folder: 'file-upload'
  });
  fs.unlinkSync(productImage.tempFilePath);
  return result.secure_url;
};

module.exports.UpdateFamily = async (mobileNumber, data) => {
  const family = await Family.findById(user.familyId);
  if (data?.image) family.image = data.image;
  else if (data?.history) family.history = data.history;
  else if (data?.name) family.name = data.name;
  await family.save();
  return family;
};
