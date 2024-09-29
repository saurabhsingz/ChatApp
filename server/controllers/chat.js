import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ErrorHandler, TryCatch } from "../utils/utility.js";

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

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  const chat = await Chat.findById(chatId);

  if (!members || members.length < 1) {
    return next(new ErrorHandler("Please provide members", 400));
  }

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to add new members", 403)
    );
  }

  const allNewMembersPromise = members.map((member) => {
    return User.findById(member, "name");
  });
  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((member) => !chat.members.includes(member._id.toString()))
    .map((member) => member._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler("Group members limit exceeded", 400));
  }

  await chat.save();

  const allUsersName = allNewMembers.map((member) => member.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added to group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Members added successfully" });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const [chat, userToRemove] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!userId) {
    return next(new ErrorHandler("Please provide member to remove", 400));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }

  if (chat.creator.toString() !== req.user) {
    return next(new ErrorHandler("You are not allowed to remove members", 403));
  }
  if (chat.member.length < 2) {
    return next(new ErrorHandler("Group must have at least 2 members", 400));
  }
  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userToRemove.name} has been removed from group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  res
    .status(200)
    .json({ success: true, message: "Member removed successfully" });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );
  if (remainingMembers < 2) {
    return next(new ErrorHandler("Group must have at least 2 members", 400));
  }
  if (req.user === chat.creator.toString()) {
    const newCreator = remainingMembers[0];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;
  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);
  console.log(user);
  emitEvent(req, ALERT, chat.members, `User ${user.name} has left the group`);

  return res
    .status(200)
    .json({ success: true, message: "Member left successfully" });
});

const sendAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  const files = req.files || [];

  if (files.length < 1) {
    return next(new ErrorHandler("Please provide attachments", 400));
  }

  //upload files here

  const attachments = [];

  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({ success: true, message });
});

const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();
    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({ success: true, chat });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }
    return res.status(200).json({ success: true, chat });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to rename group", 403));
  }

  chat.name = name;
  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Group name updated successfully" });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to delete chat", 403));
  }

  if (chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }

  //here we have to delete all messages and attachments related to this chat from cloudinary
  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Chat deleted successfully" });
});

const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;
  const messagePerPage = 20;
  const skip = (page - 1) * messagePerPage;

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(messagePerPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / messagePerPage) || 0;

  return res
    .status(200)
    .json({ success: true, messages: messages.reverse(), totalPages });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachment,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
