import BlocknoteEditorView from "@/components/blocknote/editor.view";
import type IRoute from "@/models/route.model";

const protectedRoutes: IRoute[] = [
	{
		path: "",
		index: true,
		element: <BlocknoteEditorView />,
	},
	{
		path: "gallery",
		element: <div>Gallery</div>,
	},
	{
		path: "profile",
		element: <div>Profile</div>,
	},
];

export default protectedRoutes;
