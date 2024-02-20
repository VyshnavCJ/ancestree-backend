const User = require('../../models/user.model');
const Family = require('../../models/family.model');
const Member = require('../../models/member.model');
const generateAPIError = require('../../utils/errors');

module.exports.CreateMember = async (familyId, mobileNumber, data) => {
  if (data.parentId.length == 0) data.memberId = 1;
  else {
    const parent = await Member.findOne({
      memberId: data.parentId,
      familyId: familyId
    });
    if (
      data.birthOrder > parent.noOfChildren ||
      parent.childrenAdd.includes(data.birthOrder)
    )
      throw generateAPIError('Not a child', 404);
    data.memberId = `${parent.memberId}.${data.birthOrder}`;
    parent.childrenAdd.push(data.birthOrder);
    await parent.save();
  }
  let user = await User.findOne({ mobileNumber: mobileNumber });
  data.familyId = user.familyId;
  if (data.self == true) user.memberId = data.memberId;
  await user.save();
  const member = await Member.create(data);
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
