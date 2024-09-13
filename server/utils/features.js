import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (mongoURI) =>
  mongoose
    .connect(mongoURI, {
      dbName: "chatApp",
    })
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return res
    .status(code)
    .cookie("chatToken", token, cookieOptions)
    .json({ success: true, user, message });
};

export { connectDB, sendToken, cookieOptions };
