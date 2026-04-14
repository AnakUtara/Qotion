import type { NextFunction, Request, Response } from "express";
import app, { PORT } from "./config/app.config.js";
import AppError from "./errors/app.error.js";
import apiRoute from "./routers/api.router.js";

// * Prefix all routes with /api
app.use("/api", apiRoute);

// * 404 Handler
app.use((_: Request, res: Response) => {
	console.error("404 Not Found");
	return res.status(404).send({ message: "Not Found" });
});

// * Global Error Handler
app.use((error: AppError, _: Request, res: Response, __: NextFunction) => {
	console.table(error);
	console.error(error);
	return res.status(error.status || 500).send({
		status: error.status || 500,
		message: error.message || "Internal Server Error",
		error: error.object || null,
	});
});

// * Start the server
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
