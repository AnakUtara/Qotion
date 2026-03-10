import type { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../utils/response.builder.js";
import AppError from "../errors/app.error.js";
import { prisma } from "../libs/prisma.client.js";
import { appErrorHandler } from "../errors/handlers/app.error.handler.js";
import {
	createNoteSchema,
	updateNoteSchema,
} from "../validations/notes.validation.js";
import type { Note } from "../generated/prisma/client.js";
import type {
	NoteCreateInput,
	NoteUpdateInput,
} from "../generated/prisma/models.js";

class NotesController {
	getNotes = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { search } = req.query;
			const notes: Note[] = await prisma.note.findMany({
				where: {
					...(!search
						? {}
						: {
								title: { contains: String(search), mode: "insensitive" },
							}),
					authorId: req.user!.id,
				},
				orderBy: { createdAt: "desc" },
			});
			return res.send(responseBuilder(200, "Success!", notes ?? []));
		} catch (error) {
			appErrorHandler(error, next);
		}
	};

	getNoteById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;

			const note: Note | null = await prisma.note.findFirst({
				where: { id: Number(id), authorId: req.user!.id },
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
			const submittedNote: NoteCreateInput = req.body;

			if (!req.body) throw new AppError("Request body is missing", 400);

			const validNewNote = await createNoteSchema.parseAsync(submittedNote);

			const newNote: Note = await prisma.note.create({
				data: {
					...validNewNote,
					authorId: req.user!.id,
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

			const submittedNote: NoteUpdateInput = req.body;

			if (!req.body) throw new AppError("Request body is missing", 400);

			const updatedNote: Note = await prisma.$transaction(
				async (tx): Promise<Note> => {
					const existingNote: Note | null = await tx.note.findFirst({
						where: { id: Number(id), authorId: req.user!.id },
					});

					if (!existingNote) {
						throw new AppError(`Note ID: ${id} not found`, 404);
					}

					const validatedUpdateNote = await updateNoteSchema.parseAsync({
						...submittedNote,
						authorId: existingNote.authorId,
					});

					return await tx.note.update({
						where: { id: Number(id), authorId: req.user!.id },
						data: {
							...existingNote,
							title: validatedUpdateNote.title || existingNote.title,
							content: validatedUpdateNote.content || existingNote.content!,
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
			await prisma.note.delete({
				where: { id: Number(id), authorId: req.user!.id },
			});
			return res.send(
				responseBuilder(200, `Note ID: ${id} deleted successfully`, null),
			);
		} catch (error: Error | any) {
			appErrorHandler(error, next);
		}
	};
}

export default new NotesController();
