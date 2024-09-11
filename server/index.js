import express from "express";
import userRoute from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";

dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
connectDB(mongoURI);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
