import { NextFunction } from "express";
import AppError from "../app.error";
import { Prisma } from "../../generated/prisma/client";
import { $ZodIssue } from "zod/v4/core";
import { ZodError } from "zod/v4";

export const appErrorHandler = (error: Error | any, next: NextFunction) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return next(new AppError(error.message, 400, error));
	}
	if (error instanceof ZodError) {
		const messages = error.issues
			.map((err: $ZodIssue) => `${err.path.join(" ")}: ${err.message}`)
			.join(", ");
		return next(new AppError(messages, 400, error));
	}
	return next(error);
};
