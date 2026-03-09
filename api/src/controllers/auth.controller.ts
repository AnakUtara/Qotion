import { NextFunction, Request, Response } from "express";
import { appErrorHandler } from "../errors/handlers/app.error.handler";
import { prisma } from "../libs/prisma.client";
import { comparePassword, hashPassword } from "../libs/bcrypt";
import { generateJWT, verifyJWT } from "../libs/jwt";
import { responseBuilder } from "../utils/response.builder";
import { authSchema } from "../validations/auth.validation";
import AppError from "../errors/app.error";
import { cookieConfig } from "../config/app.config";
import { User } from "../generated/prisma/client";

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

	logout = async (_req: Request, res: Response, next: NextFunction) => {
		try {
			res.clearCookie("refresh-token");
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

			res.clearCookie("refresh-token");

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
