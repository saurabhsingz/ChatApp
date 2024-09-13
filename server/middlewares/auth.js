import jwt from "jsonwebtoken";
import { ErrorHandler, TryCatch } from "../utils/utility.js";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.chatToken;

  if (!req.cookies.chatToken) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData.id;

  next();
};
export { isAuthenticated };
