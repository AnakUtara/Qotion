import type { JSX } from "react";

export default interface IRoute {
	path: string;
	index?: boolean;
	element: JSX.Element;
}
