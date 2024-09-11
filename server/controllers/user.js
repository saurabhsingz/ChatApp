import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/features.js";
import { ErrorHandler, TryCatch } from "../utils/utility.js";

const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  const avatar = { public_id: "123", url: "https://www.google.com" };
  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  sendToken(res, user, 201, "user created");
};

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  sendToken(res, user, 200, `Welcome back ${user.name}`);
});

const getMyProfile = async (req, res) => {
  console.log("hii");
  res.status(200).json({ success: true, data: req.user });
};

export { login, newUser, getMyProfile };
