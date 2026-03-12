import express, { Router } from "express";
import { appName } from "../config/env.config.js";
import { notesRouter } from "../resources/notes.resource.js";
import { authRouter } from "../resources/auth.resource.js";
import { cloudinaryStorageRouter } from "../resources/cloudinary.storage.resource.js";

const apiRouter: Router = express.Router();

// * API Welcome Route
apiRouter.get("/", (_, res) => res.send(`Welcome to the ${appName}`));

apiRouter.use("/auth", authRouter);
apiRouter.use("/notes", notesRouter);
apiRouter.use("/cloudinary-storage", cloudinaryStorageRouter);
apiRouter.use("/health", (_, res) => res.send("OK"));

export default apiRouter;
