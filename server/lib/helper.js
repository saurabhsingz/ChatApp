const getOtherMember = (members, userId) =>
  members.filter((member) => member._id.toString() !== userId.toString());

export { getOtherMember };
