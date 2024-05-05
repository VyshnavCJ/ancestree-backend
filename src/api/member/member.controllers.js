const { StatusCodes } = require('http-status-codes');
const services = require('./member.services');
const generateAPIError = require('../../utils/errors');
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

module.exports.UploadPic = async (req, res) => {
  if (!req.files) {
    throw generateAPIError('No files uploaded', 404);
  }
  const picId = await services.Upload(req.files.image);

  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Member pic uploaded',
    picId: picId
  });
};
module.exports.Search = async (req, res) => {
  const member = await services.Search(req.user.familyId, req.params.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Member Search result',
    memberPath: member
  });
};

module.exports.SearchPattern = async (req, res) => {
  const memberList = await services.MemberSearch(
    req.user.familyId,
    req.body.pattern
  );
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Member Search result',
    memberList: memberList
  });
};
