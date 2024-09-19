import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
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

const getMyChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformedChat = chats.map(({ id, name, members, groupChat }) => {
    const otherMembers = getOtherMember(members, req.user);
    return {
      id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMembers.avatar.url],
      name: groupChat ? name : otherMembers.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });
  res.status(200).json({ success: true, chats: transformedChat });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ creator: req.user }).populate(
    "members",
    "name avatar"
  );

  const groups = chats.map(({ _id, members, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  res.status(200).json({ success: true, groups });
});


const addNewMember = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  const chat = await Chat

export { newGroupChat, getMyChats, getMyGroups };
