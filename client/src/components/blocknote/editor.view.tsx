import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { video, audio, file, ...allowedBlockSpecs } = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
	blockSpecs: allowedBlockSpecs,
});

const BlocknoteEditorView = () => {
	const editor = useCreateBlockNote({
		schema,
	});

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleChange = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			const content = editor.document;
			console.log(content);
		}, 500);
	}, [editor]);

	return (
		<BlockNoteView
			editor={editor}
			className="h-screen"
			theme="light"
			onChange={handleChange}
		/>
	);
};

export default BlocknoteEditorView;
