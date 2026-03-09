import express, { Application, CookieOptions } from "express";
import { appPort, clientOrigin, isProduction } from "./env.config";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT = appPort;

//Middleware Configuration
app.set("trust proxy", 1); // Trust first proxy (if behind a reverse proxy like Nginx or Heroku)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: clientOrigin, // Next.js dev server
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
