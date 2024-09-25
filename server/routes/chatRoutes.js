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

const app = express.Router();

app.use(isAuthenticated);
app.post("/newgroupchat", newGroupChat);
app.get("/getMyChats", getMyChats);
app.get("/getMyGroups", getMyGroups);
app.put("/addmembers", addMembers);
app.put("/removemember", removeMember);
app.delete("/leave/:id", leaveGroup);

//Send attachments
app.post("/message", attachmentMulter, sendAttachment);

// get messages
app.get("/messages/:id", getMessages);

//get chat details, rename and details
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;
