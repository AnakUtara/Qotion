import express, { Application, CookieOptions } from "express";
import { appPort, isProduction } from "./env.config";
import cors from "cors";

const app: Application = express();
const PORT = appPort;

//Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173", // Next.js dev server
		credentials: true, // if you need to send cookies
	}),
);

const cookieConfig: CookieOptions = {
	httpOnly: true,
	sameSite: isProduction ? "none" : "lax",
	secure: isProduction,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export default app;
export { PORT, cookieConfig };
