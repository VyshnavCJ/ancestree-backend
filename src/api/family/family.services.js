const Family = require('../../models/family.model');
const generateAPIError = require('../../utils/errors');
const { generateJwt } = require('../../utils');
const User = require('../../models/user.model');

module.exports.Create = async (data, mobileNumber) => {
  const family = await Family.create(data);
  const user = await User.updateOne(
    { mobileNumber: mobileNumber },
    { familyId: family._id }
  );
  return family;
};
