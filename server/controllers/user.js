import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/features.js";

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

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = user && (await compare(password, user.password));
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  sendToken(res, user, 200, `Welcome back ${user.name}`);
};

export { login, newUser };
