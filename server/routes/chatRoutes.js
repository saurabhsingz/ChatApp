import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, getMyGroups, newGroupChat } from "../controllers/chat.js";

const app = express.Router();

app.use(isAuthenticated);
app.post("/newgroupchat", newGroupChat);
app.get("/getMyChats", getMyChats);
app.get("/getMyGroups", getMyGroups);

export default app;
