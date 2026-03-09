import useNoteMutation from "@/hooks/mutations/use-notes.mutation";
import {
	uploadImage,
	uploadFile as uploadDocFile,
} from "@/services/storage.service";
import {
	BlockNoteSchema,
	defaultBlockSpecs,
	type Block,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { AxiosError } from "axios";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { video, audio, ...allowedBlockSpecs } = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
	blockSpecs: allowedBlockSpecs,
});

const defaultContent = [
	{
		type: "heading",
		content: "Title",
	},
	{
		type: "paragraph",
		content: "Start writing your note here...",
	},
] as unknown as Block[];

const uploadFile = async (file: File): Promise<string> => {
	try {
		if (file.type.startsWith("image/")) {
			return await uploadImage(file);
		} else if (file.type.startsWith("application/")) {
			return await uploadDocFile(file);
		} else {
			throw new Error("Only image and doc/ppt/txt/pdf files are allowed");
		}
	} catch (error) {
		toast.error(
			error instanceof AxiosError && error.response?.data?.message
				? error.response.data.message
				: error instanceof Error
					? error.message
					: "File upload failed! Please try again.",
		);
		return "";
	}
};

interface BlocknoteEditorViewProps {
	initialContent?: Block[];
	noteId?: number;
}

const BlocknoteEditorView = ({
	initialContent,
	noteId,
}: BlocknoteEditorViewProps) => {
	const noteIdRef = useRef<number | null>(noteId ?? null);

	const { create, update } = useNoteMutation();

	const editor = useCreateBlockNote({
		initialContent: initialContent ?? defaultContent,
		schema,
		uploadFile,
	});

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleChange = useCallback(async () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(async () => {
			const document = editor.document;
			console.log(document);
			const title =
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(document[0]?.content as any)?.[0]?.text?.trim() || "Untitled Note";
			try {
				if (!noteIdRef.current) {
					const res = await create.mutateAsync({ title, document });
					noteIdRef.current = res.id;
				} else {
					await update.mutateAsync({ id: noteIdRef.current, title, document });
				}
			} catch (error) {
				if (error instanceof AxiosError && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Failed to save note");
				}
			}
		}, 500);
	}, [create, editor, update]);

	return (
		<BlockNoteView editor={editor} theme="light" onChange={handleChange} />
	);
};

export default BlocknoteEditorView;
