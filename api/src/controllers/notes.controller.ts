import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../utils/response.builder";
import AppError from "../errors/app.error";
import { prisma } from "../libs/prisma.client";
import { appErrorHandler } from "../errors/handlers/app.error.handler";
import { Post } from "../generated/prisma";
import { TPost } from "../models/notes.model";
import {
	createPostSchema,
	updatePostSchema,
} from "../validations/posts.validation";

class NotesController {
	getNotes = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { search } = req.query;
			const posts: Post[] = await prisma.post.findMany({
				where: !search
					? {}
					: {
							title: { contains: String(search), mode: "insensitive" },
						},
			});
			if (!posts || posts.length === 0) {
				return res
					.status(404)
					.send(responseBuilder(404, "No posts found", null));
			}
			return res.send(responseBuilder(200, "Success!", posts));
		} catch (error) {
			appErrorHandler(error, next);
		}
	};

	getNoteById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const note: TPost = await prisma.post.findFirst({
				where: { id: Number(id) },
			});
			if (!note) {
				return res
					.status(404)
					.send(responseBuilder(404, `Note ID: ${id} not found`, null));
			}
			return res.send(responseBuilder(200, "Success!", note));
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	createNote = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const submittedNote: Post = req.body;
			if (!req.body) throw new AppError("Request body is missing", 400);
			const validNewNote = await createPostSchema.validate(submittedNote);
			const newNote: Post = await prisma.post.create({
				data: {
					...validNewNote,
					userId: req.user!.id,
				},
			});
			return res
				.status(201)
				.send(responseBuilder(201, "Note created successfully", newNote));
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	updateNote = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const submittedNote: Post = req.body;
			if (!req.body) throw new AppError("Request body is missing", 400);
			const updatedNote: TPost = await prisma.$transaction(
				async (tx): Promise<TPost> => {
					const existingNote: TPost = await tx.post.findFirst({
						where: { id: Number(id) },
					});
					if (!existingNote) {
						throw new AppError(`Note ID: ${id} not found`, 404);
					}
					const validatedUpdateNote = await updatePostSchema.validate({
						...submittedNote,
						userId: existingNote.userId,
					});
					return await tx.post.update({
						where: { id: Number(id) },
						data: {
							...existingNote,
							title: validatedUpdateNote.title || existingNote.title,
							content: validatedUpdateNote.content || existingNote.content,
							publishedAt:
								validatedUpdateNote.publishedAt || existingNote.publishedAt,
						},
					});
				},
			);
			return res.send(
				responseBuilder(200, "Note updated successfully", updatedNote),
			);
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};

	deleteNote = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			await prisma.post.delete({ where: { id: Number(id) } });
			return res.send(
				responseBuilder(200, `Note ID: ${id} deleted successfully`, null),
			);
		} catch (error) {
			appErrorHandler(error, next);
		}
	};
}

export default new NotesController();
