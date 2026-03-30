import { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedMimiTypes = /jpeg|png|gif|webp|jpg/;

  const extention = allowedMimiTypes.test(path.extname(file.originalname));
  const mimiType = allowedMimiTypes.test(file.mimetype);

  if (extention && mimiType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File type not allowed, only jpeg, png, gif, webp, and jpg are allowed",
      ),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB
    files: 1,
  },
});
