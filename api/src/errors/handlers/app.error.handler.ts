import type { NextFunction } from "express";
import AppError from "../app.error.js";
import { Prisma } from "../../generated/prisma/client.js";
import type { $ZodIssue } from "zod/v4/core";
import { ZodError } from "zod/v4";
import jwt from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = jwt;

export const appErrorHandler = (error: Error | any, next: NextFunction) => {
	if (error instanceof TokenExpiredError) {
		return next(new AppError("Token expired", 401, error));
	}
	if (error instanceof JsonWebTokenError) {
		return next(new AppError("Invalid token", 401, error));
	}
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case "P2002":
				return next(new AppError("Already exists", 409, error));
			case "P2025":
				return next(new AppError("Record not found", 404, error));
			default:
				return next(new AppError("Database error", 400, error));
		}
	}
	if (error instanceof Prisma.PrismaClientValidationError) {
		return next(
			new AppError("Data not found/Invalid data provided", 400, error),
		);
	}
	if (error instanceof ZodError) {
		const messages = error.issues
			.map((err: $ZodIssue) => `${err.path.join(" ")}: ${err.message}`)
			.join(", ");
		return next(new AppError(messages, 400, error));
	}
	return next(error);
};
