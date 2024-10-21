import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

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

const emitEvent = (req, event, users, data) => {
  console.log("emitting event", event);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  });
};

const deleteFilesFromCloudinary = async (publicIds) => {
  //delete files from cloudinary
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
