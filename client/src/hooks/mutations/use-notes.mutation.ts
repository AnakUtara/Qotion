import { createNote, deleteNote, updateNote } from "@/services/notes.service";
import type { Block } from "@blocknote/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTES_QUERY_KEY } from "../queries/use-notes.query";

const useNoteMutation = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: async ({
			title,
			document,
		}: {
			title: string;
			document: Block[];
		}) => {
			return await createNote(title, document);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [NOTES_QUERY_KEY],
			});
		},
	});

	const update = useMutation({
		mutationFn: async ({
			id,
			title,
			document,
		}: {
			id: number;
			title: string;
			document: Block[];
		}) => {
			return await updateNote(id, title, document);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [NOTES_QUERY_KEY],
			});
		},
	});

	const erase = useMutation({
		mutationFn: async (id: number) => {
			return await deleteNote(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [NOTES_QUERY_KEY],
			});
		},
	});

	return { create, update, erase };
};

export default useNoteMutation;
