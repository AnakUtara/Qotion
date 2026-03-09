import express, { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { imageUploader, fileUploader } from "../middlewares/express/multer";
import cloudinaryStorageController from "../controllers/cloudinary.storage.controller";

export const cloudinaryStorageRouter: Router = express.Router();

cloudinaryStorageRouter.post(
	"/image",
	verifyAccessToken,
	imageUploader.single("file"),
	cloudinaryStorageController.uploadImage,
);

cloudinaryStorageRouter.post(
	"/file",
	verifyAccessToken,
	fileUploader.single("file"),
	cloudinaryStorageController.uploadFile,
);
