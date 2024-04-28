const User = require('../../models/user.model');
const Family = require('../../models/family.model');
const Member = require('../../models/member.model');
const generateAPIError = require('../../utils/errors');
const { treeFileUpdate, memberTreePath } = require('./member.helpers');
const fs = require('fs');
const { drive } = require('../../utils');

module.exports.CreateMember = async (familyId, mobileNumber, data) => {
  if (data.parentId.length == 0) {
    data.memberId = 1;
  } else {
    const parent = await Member.findOne({
      memberId: data.parentId,
      familyId: familyId
    });
    if (data.birthOrder > parent.noOfChildren)
      throw generateAPIError('Not a child', 404);
    if (parent.childrenAdd.includes(data.birthOrder))
      throw generateAPIError('Child present', 404);
    data.memberId = `${parent.memberId}.${data.birthOrder}`;
    parent.childrenAdd.push(data.birthOrder);
    await parent.save();
  }
  let user = await User.findOne({ mobileNumber: mobileNumber });
  data.familyId = user.familyId;
  if (data.self == true) user.memberId = data.memberId;
  await user.save();
  const member = await Member.create(data);
  const family = await Family.findById(familyId);
  await treeFileUpdate(member, family);
  return member;
};

module.exports.View = async (familyId, id) => {
  const member = await Member.findOne({ memberId: id, familyId: familyId });
  if (!member) throw generateAPIError('Member not found', 401);
  return member;
};

module.exports.Edit = async (familyId, data) => {
  const member = await Member.findOne({
    memberId: data.memberId,
    familyId: familyId
  });
  if (data?.WmobileNumber) member.WmobileNumber = data.WmobileNumber;
  if (data?.name) member.name = data.name;
  if (data?.email) member.email = data.email;
  if (data?.dob) member.dob = data.dob;
  if (data?.alterMobileNumber)
    member.alterMobileNumber = data.alterMobileNumber;
  if (data?.spouse) member.spouse = data.spouse;
  if (data?.occupation) member.occupation = data.occupation;
  if (data?.address) member.address = data.address;
  if (data?.noOfChildren) member.noOfChildren = data.noOfChilder;
  await member.save();
  return member;
};

module.exports.Search = async (familyId, memberId) => {
  const family = await Family.findById(familyId);
  const memberPath = await memberTreePath(family, memberId);
  return memberPath;
};

module.exports.MemberSearch = async (familyId, pattern) => {
  const memberList = await Member.find({
    familyId: familyId,
    name: { $regex: new RegExp(pattern, 'i') }
  }).select('name memberId WmobileNumber');
  return memberList;
};

module.exports.Upload = async (image) => {
    const pic = await drive.files.create({
        media: {
            mimeType: image.mimeType,
            body: fs.createReadStream(image.tempFilePath)
        },
        requestBody: {
            name: image.name,
            parents: ['1TsGsVMt5KwFrdVwQ4mUo4xhluuvuFVWy']
        },
        fields: 'id,name'
    });
    fs.unlinkSync(image.tempFilePath);
    return pic.id
};
