import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/react-query/query-client.ts";
import RouterProvider from "./router/provider/router.provider.tsx";
import AuthProvider from "./components/providers/auth.provider.tsx";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/shadcn-ui/tooltip.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_AUTH_CLIENT_ID } from "./config/app.config.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HelmetProvider>
			<GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
						<Toaster />
						<TooltipProvider>
							<RouterProvider />
						</TooltipProvider>
					</QueryClientProvider>
				</AuthProvider>
			</GoogleOAuthProvider>
		</HelmetProvider>
	</StrictMode>,
);
