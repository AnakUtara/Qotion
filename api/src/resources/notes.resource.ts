import express, { Router } from "express";
import notesController from "../controllers/notes.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";

export const notesRouter: Router = express.Router();

// * Note Resources
notesRouter.get("/", verifyAccessToken, notesController.getNotes);
notesRouter.post("/", verifyAccessToken, notesController.createNote);
notesRouter.get("/:id", verifyAccessToken, notesController.getNoteById);
notesRouter.put("/:id", verifyAccessToken, notesController.updateNote);
notesRouter.delete("/:id", verifyAccessToken, notesController.deleteNote);
