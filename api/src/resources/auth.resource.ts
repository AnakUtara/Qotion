import express, { Router } from "express";
import {
	uniqueUserGuard,
	verifyAccessToken,
	verifyRefreshToken,
} from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";

export const authRouter: Router = express.Router();

// * Auth Resources
authRouter.post("/login", authController.login);
authRouter.post("/register", uniqueUserGuard, authController.register);
authRouter.post(
	"/refresh-token",
	verifyRefreshToken,
	authController.refreshToken,
);
authRouter.post("/logout", authController.logout);
authRouter.get("/user", verifyAccessToken, authController.getAuthUser);
