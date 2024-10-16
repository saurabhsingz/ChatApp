import { userSocketIDs } from "../index.js";

const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user._id.toString()));

export { getOtherMember, getSockets };
