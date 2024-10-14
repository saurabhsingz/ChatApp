import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middlewares/auth.js";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { createMessagesInAChat } from "./Seeder/chatSeeder.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE } from "./constants/event.js";

dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const envMode = process.env.NODE_ENV || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "randomSecretKey";

connectDB(mongoURI);

const app = express();
const server = createServer(app);
const io = new Server(server, {});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", adminRoutes);

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, messages }) => {
    console.log("New Message");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} mode`);
});

export { envMode, adminSecretKey };
