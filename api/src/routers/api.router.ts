import express, { Router } from "express";
import { appName } from "../config/env.config";
import { notesRouter } from "../resources/notes.resource";
import { authRouter } from "../resources/auth.resource";

const apiRouter: Router = express.Router();

// * API Welcome Route
apiRouter.get("/", (_, res) => res.send(`Welcome to the ${appName}`));

apiRouter.use("/auth", authRouter);
apiRouter.use("/notes", notesRouter);

export default apiRouter;
