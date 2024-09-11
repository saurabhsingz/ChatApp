import multer from "multer";

const uploadMulter = multer({ limits: { fileSize: 1024 * 1024 * 5 } });

const singleAvatar = uploadMulter.single("avatar");

export { singleAvatar };
