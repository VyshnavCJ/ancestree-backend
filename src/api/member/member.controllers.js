const { StatusCodes } = require('http-status-codes');
const services = require('./member.services');
module.exports.Create = async (req, res) => {
  const member = await services.CreateMember(
    req.user.familyId,
    req.user.mobileNumber,
    req.body
  );
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Member Created',
    member: member
  });
};

module.exports.View = async (req, res) => {
  const member = await services.View(req.user.familyId, req.params.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Member Details',
    member: member
  });
};
module.exports.Edit = async (req, res) => {
  const member = await services.Edit(req.user.familyId, req.body);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Member Updated',
    member: member
  });
};
