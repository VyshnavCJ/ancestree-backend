const jwt = require('jsonwebtoken');
const { generateAPIError } = require('.././utils/errors');

module.exports.auth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer'))
      return next(generateAPIError('Authentication invalid', 401));

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload.payload;
      next();
    } catch (error) {
      return next(generateAPIError('Authentication invalid', 401));
    }
  };
};
