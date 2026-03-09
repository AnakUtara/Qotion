import BlocknoteEditorView from "@/components/blocknote/editor.view";
import { useSingleNoteQuery } from "@/hooks/queries/use-notes.query";
import LoadingScreen from "@/pages/loading.screen";
import { useParams } from "react-router";

const NotePage = () => {
	const { id } = useParams();
	const { data: note, isLoading } = useSingleNoteQuery(Number(id));

	if (isLoading) return <LoadingScreen />;

	return (
		<BlocknoteEditorView
			key={note?.id}
			initialContent={note?.content}
			noteId={note?.id}
		/>
	);
};

export default NotePage;
