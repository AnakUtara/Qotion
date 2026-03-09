// import App from "@/App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ErrorPage from "@/pages/error/error.page";
import type IRoute from "@/models/route.model";
import protectedRoutes from "../routes/protected.routes";
import publicRoutes from "../routes/public.routes";
import SEO from "@/components/seo/seo";
import AuthLayout from "@/components/layout/auth.layout";
import ProtectedLayout from "@/components/layout/protected.layout";

const RouterProvider = () => {
	return (
		<BrowserRouter>
			<SEO title="Qotion" description="Qotion - Your simple note-taking app" />
			<Routes>
				<Route errorElement={<ErrorPage />}>
					<Route element={<AuthLayout />}>
						<Route index element={<Navigate to="/login" replace />} />
						{publicRoutes.map((route: IRoute) => (
							<Route key={route.path} {...route} />
						))}
					</Route>
					<Route path="/notes" element={<ProtectedLayout />}>
						{protectedRoutes.map((route: IRoute) => (
							<Route key={route.path} {...route} />
						))}
					</Route>
				</Route>
				<Route path="*" element={<div>Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterProvider;
