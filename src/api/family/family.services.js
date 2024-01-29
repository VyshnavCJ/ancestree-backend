const Family = require('./family.model');
const generateAPIError = require('../../utils/errors');
const { generateJwt } = require('../../utils');

module.exports.Create = async (data) => {
  const family = await Family.create(data);
  return family;
};
