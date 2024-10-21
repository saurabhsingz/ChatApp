import { userSocketIDs } from "../index.js";

const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user._id.toString()));

const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export { getOtherMember, getSockets, getBase64 };
