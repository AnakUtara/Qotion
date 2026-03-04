import express, { Router } from "express";
import notesController from "../controllers/notes.controller";
import { verifyToken } from "../middlewares/auth.middleware";

export const notesRouter: Router = express.Router();

// * Note Resources
notesRouter.get("/", verifyToken, notesController.getNotes);
notesRouter.post("/", verifyToken, notesController.createNote);
notesRouter.get("/:id", verifyToken, notesController.getNoteById);
notesRouter.put("/:id", verifyToken, notesController.updateNote);
notesRouter.delete("/:id", verifyToken, notesController.deleteNote);
