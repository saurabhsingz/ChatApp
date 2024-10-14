import { body, check, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const erroMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(erroMessages, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

const newGroupChatValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter members")
    .isArray({ max: 100 })
    .withMessage("Maximum members allowed is 100"),
];

const addMembersValidator = () => [
  body("chatId", "Please Enter chatId").notEmpty(),
  body("members").notEmpty().withMessage("Please Enter members"),
];

const removeMemberValidator = () => [
  body("chatId", "Please Enter chatId").notEmpty(),
  body("userId", "Please Enter memberId").notEmpty(),
];

const leaveGroupValidator = () => [
  param("id", "Please Enter chatId").notEmpty(),
];

const sendAttachmentValidator = () => [
  body("chatId", "Please Enter chatId").notEmpty(),
];

const chatIdValidator = () => [param("id", "Please Enter chatId").notEmpty()];

const renameValidator = () => [
  param("id", "Please Enter chatId").notEmpty(),
  body("name", "Please Enter Name").notEmpty(),
];

const requestValidator = () => [
  body("receiverId", "Please Enter userId").notEmpty(),
];

const requestResponseValidator = () => [
  body("requestId", "Please Enter requestId").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Enter your response")
    .isBoolean()
    .withMessage("Accept must be boolean"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
];

export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupChatValidator,
  addMembersValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentValidator,
  chatIdValidator,
  renameValidator,
  requestValidator,
  requestResponseValidator,
  adminLoginValidator,
};
