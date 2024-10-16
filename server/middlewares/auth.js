import jwt from "jsonwebtoken";
import { ErrorHandler, TryCatch } from "../utils/utility.js";
import { adminSecretKey } from "../index.js";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies.chatToken;

  if (!req.cookies.chatToken) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData.id;

  next();
});

const adminOnly = (req, res, next) => {
  const token = req.cookies["chat-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};

export { isAuthenticated, adminOnly };
