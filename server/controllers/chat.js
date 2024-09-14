import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { Chat } from "../models/chatModel.js";
import { emitEvent } from "../utils/features.js";
import { TryCatch } from "../utils/utility.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  console.log(req.user);

  const allMembers = [...members, req.user];
  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  res.status(201).json({ success: true, message: "Group created" });
});

export { newGroupChat };
