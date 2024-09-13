import express from "express";
import userRoute from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middlewares/auth.js";

dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
connectDB(mongoURI);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
