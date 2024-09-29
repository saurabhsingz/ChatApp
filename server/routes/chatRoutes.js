import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachment,
} from "../controllers/chat.js";
import { attachmentMulter } from "../middlewares/multer.js";
import {
  addMembersValidator,
  chatIdValidator,
  leaveGroupValidator,
  newGroupChatValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentValidator,
  validateHandler,
} from "../lib/validator.js";

const app = express.Router();

app.use(isAuthenticated);
app.post(
  "/newgroupchat",
  newGroupChatValidator(),
  validateHandler,
  newGroupChat
);
app.get("/getMyChats", getMyChats);
app.get("/getMyGroups", getMyGroups);
app.put("/addmembers", addMembersValidator(), validateHandler, addMembers);
app.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);
app.delete("/leave/:id", leaveGroupValidator(), validateHandler, leaveGroup);

//Send attachments
app.post(
  "/message",
  attachmentMulter,
  sendAttachmentValidator(),
  validateHandler,
  sendAttachment
);

// get messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

//get chat details, rename and details
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);

export default app;
