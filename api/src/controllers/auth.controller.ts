import type { NextFunction, Request, Response } from "express";
import { appErrorHandler } from "../errors/handlers/app.error.handler.js";
import { prisma } from "../libs/prisma.client.js";
import { comparePassword, hashPassword } from "../libs/bcrypt.js";
import { generateJWT } from "../libs/jwt.js";
import { responseBuilder } from "../utils/response.builder.js";
import { authSchema } from "../validations/auth.validation.js";
import AppError from "../errors/app.error.js";
import { cookieConfig } from "../config/app.config.js";
import type { User } from "../generated/prisma/client.js";
import { OAuth2Client } from "google-auth-library";
import { googleClientId } from "../config/env.config.js";

const googleClient = new OAuth2Client(googleClientId);

class AuthController {
	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;

			const validAuth = await authSchema.parseAsync({
				email,
				password,
			});

			const hashedPassword = await hashPassword(validAuth.password);

			if (!hashedPassword) {
				throw new AppError("Error hashing password", 500);
			}

			await prisma.user.create({
				data: {
					email: validAuth.email,
					password: hashedPassword,
				},
			});

			return res
				.status(201)
				.send(responseBuilder(201, "User registered successfully", null));
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;

			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (!existingUser) {
				throw new AppError("Invalid email or password", 401);
			}

			if (!existingUser.password) {
				throw new AppError("Please sign in with Google", 401);
			}

			await prisma.refreshToken.deleteMany({
				where: { userId: existingUser.id },
			});

			const isPasswordValid = await comparePassword(
				password,
				existingUser.password,
			);

			if (!isPasswordValid) {
				throw new AppError("Invalid email or password", 401);
			}

			// Generate JWT token
			const { password: p, ...user } = existingUser; // Exclude password from user object

			const accessToken = generateJWT({
				id: existingUser.id,
				email: existingUser.email,
			});

			const refreshToken = generateJWT(
				{
					id: existingUser.id,
					email: existingUser.email,
				},
				"refresh",
			);

			await prisma.refreshToken.create({
				data: {
					token: refreshToken,
					userId: existingUser.id,
				},
			});

			return res.cookie("refresh-token", refreshToken, cookieConfig).send(
				responseBuilder(200, "Login successful", {
					user,
					accessToken,
				}),
			);
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	googleLogin = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { idToken } = req.body;
			if (!idToken) throw new AppError("Google ID token missing", 400);

			const ticket = await googleClient.verifyIdToken({
				idToken,
				audience: googleClientId,
			});

			const payload = ticket.getPayload();
			if (!payload?.email || !payload.sub) {
				throw new AppError("Invalid Google token payload", 401);
			}

			const { email, sub: providerAccountId } = payload;

			const user = await prisma.user.upsert({
				where: { email },
				create: { email },
				update: {},
			});

			await prisma.account.upsert({
				where: {
					provider_providerAccountId: {
						provider: "google",
						providerAccountId,
					},
				},
				create: {
					provider: "google",
					providerAccountId,
					userId: user.id,
				},
				update: {},
			});

			await prisma.refreshToken.deleteMany({
				where: { userId: user.id },
			});

			const accessToken = generateJWT({ id: user.id, email: user.email });
			const refreshToken = generateJWT(
				{ id: user.id, email: user.email },
				"refresh",
			);

			await prisma.refreshToken.create({
				data: { token: refreshToken, userId: user.id },
			});

			const { password: _p, ...safeUser } = user;

			return res.cookie("refresh-token", refreshToken, cookieConfig).send(
				responseBuilder(200, "Login successful", {
					user: safeUser,
					accessToken,
				}),
			);
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	logout = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refreshToken = req.cookies["refresh-token"];
			if (refreshToken) {
				await prisma.refreshToken.deleteMany({
					where: { token: refreshToken },
				});
			}
			res.clearCookie("refresh-token", cookieConfig);
			return res.send(responseBuilder(200, "Logout successful", null));
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) throw new AppError("User not authenticated", 401);

			const user = await prisma.user.findUnique({
				where: { id: req.user.id },
				select: {
					id: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!user) throw new AppError("User not found", 404);

			return res.send(responseBuilder(200, "Success", user));
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	refreshToken = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) throw new AppError("User not authenticated", 401);

			const { id, email } = req.user as User;

			const user = await prisma.user.findUnique({
				where: { id },
				select: {
					id: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!user) throw new AppError("User not found", 404);

			const newAccessToken = generateJWT({ id, email });
			const newRefreshToken = generateJWT({ id, email }, "refresh");

			console.log(
				"old refresh token:",
				req.cookies["refresh-token"],
				"user id:",
				id,
			);

			await prisma.refreshToken.update({
				where: { token: req.cookies["refresh-token"], userId: id },
				data: {
					token: newRefreshToken,
				},
			});

			return res.cookie("refresh-token", newRefreshToken, cookieConfig).send(
				responseBuilder(200, "Token refreshed successfully", {
					user,
					accessToken: newAccessToken,
				}),
			);
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};
}

export default new AuthController();
