import { useAuth } from "@/hooks/auth/use-auth";
import LoadingScreen from "@/pages/loading.screen";
import { Navigate, Outlet } from "react-router";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "../shadcn-ui/sidebar";
import { Separator } from "../shadcn-ui/separator";
import { AppSidebar } from "../shadcn-blocks/app-sidebar";
import SEO from "../seo/seo";

const ProtectedLayout = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) return <LoadingScreen />;

	if (!user) return <Navigate to="/login" replace />;
	return (
		<>
			<SEO
				title={`Qotion | ${user.email}'s Notes`}
				description={`${user.email}'s personal notes`}
			/>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4">
						<Outlet />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
};

export default ProtectedLayout;
