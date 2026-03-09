import BlocknoteEditorView from "@/components/blocknote/editor.view";
import NotePage from "@/pages/notes/note.page";
import type IRoute from "@/models/route.model";

const protectedRoutes: IRoute[] = [
	{
		path: "",
		index: true,
		element: <BlocknoteEditorView />,
	},
	{
		path: ":id",
		element: <NotePage />,
	},
];

export default protectedRoutes;
