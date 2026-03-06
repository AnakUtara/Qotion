import type IRoute from "@/models/route.model";
import LoginPage from "@/pages/auth/login.page";
import RegisterPage from "@/pages/auth/register.page";

const publicRoutes: IRoute[] = [
	{
		path: "login",
		element: <LoginPage />,
	},
	{
		path: "register",
		element: <RegisterPage />,
	},
];

export default publicRoutes;
