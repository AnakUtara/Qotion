import type { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma.client.js";
import { appErrorHandler } from "../errors/handlers/app.error.handler.js";
import { verifyJWT } from "../libs/jwt.js";
import AppError from "../errors/app.error.js";
import type { User } from "../generated/prisma/client.js";

export const uniqueUserGuard = async (
	req: Request,
	_: Response,
	next: NextFunction,
) => {
	try {
		const { email } = req.body;
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (user) throw new AppError("User already exists", 400);
		next();
	} catch (error) {
		appErrorHandler(error, next);
	}
};

// NOTE: For future role-based access control implementation
// export const adminGuard = async (
// 	req: Request,
// 	_: Response,
// 	next: NextFunction,
// ) => {
// 	try {
// 		if (!req.user) throw new AppError("User not authenticated", 401);
// 		if (req.user.role !== "ADMIN")
// 			throw new AppError("Access denied: Admins only", 403);
// 		next();
// 	} catch (error) {
// 		appErrorHandler(error, next);
// 	}
// };

export const verifyAccessToken = async (
	req: Request,
	_: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) throw new AppError("Authorization header missing", 401);
		const token = authHeader.split(" ")[1];
		if (!token) throw new AppError("Token missing", 401);
		const decoded = verifyJWT(token);
		if (!decoded) throw new AppError("Invalid token", 403);
		req.user = decoded as User;
		next();
	} catch (error) {
		appErrorHandler(error, next);
	}
};

export const verifyRefreshToken = async (
	req: Request,
	_: Response,
	next: NextFunction,
) => {
	try {
		const refreshToken = req.cookies["refresh-token"];
		if (!refreshToken) throw new AppError("Refresh token missing", 401);
		const decoded = verifyJWT(refreshToken, "refresh");
		if (!decoded) throw new AppError("Invalid refresh token", 403);
		req.user = decoded as User;
		next();
	} catch (error) {
		appErrorHandler(error, next);
	}
};
