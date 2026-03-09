import XCenteredContainer from "@/components/containers/x-centered-container.layout";
import { useRouteError } from "react-router";
import AppError from "@/models/errors/app.error";

const ErrorPage = () => {
	const error = useRouteError();
	return (
		<XCenteredContainer>
			<div className="flex flex-col gap-4 items-center justify-center">
				<h3 className="text-3xl font-extrabold">Oops! Something went wrong.</h3>
				<p className="text-muted-foreground">
					Error:{" "}
					{error instanceof Error || error instanceof AppError
						? error.message
						: "Unknown error"}
				</p>
			</div>
		</XCenteredContainer>
	);
};

export default ErrorPage;
