import type { ComponentProps, ReactNode } from "react";

const XCenteredContainer = ({
	children,
	className = "",
	...props
}: ComponentProps<"div"> & { children: ReactNode; className?: string }) => {
	return (
		<div className={`container mx-auto p-8 ${className}`} {...props}>
			{children}
		</div>
	);
};

export default XCenteredContainer;
