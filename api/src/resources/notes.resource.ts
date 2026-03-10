import express, { Router } from "express";
import notesController from "../controllers/notes.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
	noteCreationRateLimiter,
	noteDeletionRateLimiter,
	noteUpdateRateLimiter,
} from "../middlewares/rate-limiter.middleware.js";

export const notesRouter: Router = express.Router();

// * Note Resources
notesRouter.get("/", verifyAccessToken, notesController.getNotes);
notesRouter.post(
	"/",
	verifyAccessToken,
	noteCreationRateLimiter,
	notesController.createNote,
);
notesRouter.get("/:id", verifyAccessToken, notesController.getNoteById);
notesRouter.put(
	"/:id",
	verifyAccessToken,
	noteUpdateRateLimiter,
	notesController.updateNote,
);
notesRouter.delete(
	"/:id",
	verifyAccessToken,
	noteDeletionRateLimiter,
	notesController.deleteNote,
);
