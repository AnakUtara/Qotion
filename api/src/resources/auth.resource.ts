import express, { Router } from "express";
import {
	uniqueUserGuard,
	verifyAccessToken,
	verifyRefreshToken,
} from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";
import {
	loginRateLimiter,
	refreshTokenRateLimiter,
	registerRateLimiter,
} from "../middlewares/rate-limiter.middleware";

export const authRouter: Router = express.Router();

// * Auth Resources
authRouter.post("/login", loginRateLimiter, authController.login);
authRouter.post(
	"/register",
	registerRateLimiter,
	uniqueUserGuard,
	authController.register,
);
authRouter.post(
	"/refresh-token",
	refreshTokenRateLimiter,
	verifyRefreshToken,
	authController.refreshToken,
);
authRouter.post("/logout", authController.logout);
authRouter.get("/user", verifyAccessToken, authController.getAuthUser);
