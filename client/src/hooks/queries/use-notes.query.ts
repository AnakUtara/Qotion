import { getNoteById, getNotes } from "@/services/notes.service";
import { useQuery } from "@tanstack/react-query";

export const NOTES_QUERY_KEY = "notes";

const useAllNotesQuery = (search?: string) => {
	return useQuery({
		queryKey: search ? [NOTES_QUERY_KEY, search] : [NOTES_QUERY_KEY],
		queryFn: () => getNotes(search),
	});
};

export const useSingleNoteQuery = (id: number) => {
	return useQuery({
		queryKey: [NOTES_QUERY_KEY, id],
		queryFn: () => getNoteById(id),
	});
};

export default useAllNotesQuery;
