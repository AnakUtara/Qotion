import { APP_NAME } from "@/config/app.config";
import { useAuth } from "@/hooks/auth/use-auth";
import LoadingScreen from "@/pages/loading.screen";
import { GalleryVerticalEnd } from "lucide-react";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) return <LoadingScreen />;

	if (user) return <Navigate to="/notes" replace />;

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a href="#" className="flex items-center gap-2 font-medium">
						<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						{APP_NAME}
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<Outlet />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<img
					src="https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
};

export default AuthLayout;
