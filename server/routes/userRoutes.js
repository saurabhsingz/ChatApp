import express from "express";
import { getMyProfile, login, newUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/newuser", singleAvatar, newUser);
app.post("/login", login);
app.get("/profile", isAuthenticated, getMyProfile);

export default app;
