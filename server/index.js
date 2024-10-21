import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/event.js";
import { getSockets } from "./lib/helper.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./utils/features.js";

dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const envMode = process.env.NODE_ENV || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "randomSecretKey";
const userSocketIDs = new Map();

connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

io.on("connection", (socket) => {
  const user = {
    _id: "abc",
    name: "Subh",
  };

  userSocketIDs.set(user._id.toString(), socket.id);
  console.log("User connected", userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, messages }) => {
    const messageForRealTime = {
      content: messages,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: messages,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    console.log("New Message", messageForRealTime);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} mode`);
});

export { adminSecretKey, envMode, userSocketIDs };
