import express from "express";
import {
  acceptRequest,
  getAllNotifications,
  getMyFriends,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendRequest,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  loginValidator,
  registerValidator,
  requestResponseValidator,
  requestValidator,
  validateHandler,
} from "../lib/validator.js";

const app = express.Router();

app.post(
  "/newuser",
  singleAvatar,
  registerValidator(),
  validateHandler,
  newUser
);
app.post("/login", loginValidator(), validateHandler, login);
app.use(isAuthenticated);
app.get("/profile", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/sendrequest", requestValidator(), validateHandler, sendRequest);
app.put(
  "/acceptrequest",
  requestResponseValidator(),
  validateHandler,
  acceptRequest
);

app.get("/notifications", getAllNotifications);
app.get("/friends", getMyFriends);

export default app;
