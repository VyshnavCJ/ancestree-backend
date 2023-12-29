const APIError = require('./apiError');

const generateAPIError = (msg, statusCode) => {
  return new APIError(msg, statusCode);
};

module.exports = { generateAPIError };
