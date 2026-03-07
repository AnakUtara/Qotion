import axiosInstance from "@/lib/axios/axios.config";
import type INote from "@/models/note.model";
import type { Block } from "@blocknote/core";

export const getNotes = async (search?: string): Promise<INote[]> => {
	const res = await axiosInstance().get("/notes", {
		params: { search },
	});
	return res.data.data;
};

export const getNoteById = async (id: number): Promise<INote> => {
	const res = await axiosInstance().get(`/notes/${id}`);
	return res.data.data;
};

export const createNote = async (
	title: string,
	document: Block[],
): Promise<INote> => {
	const res = await axiosInstance().post("/notes", {
		title,
		content: document,
	});
	return res.data.data;
};

export const updateNote = async (
	id: number,
	title: string,
	document: Block[],
): Promise<INote> => {
	const res = await axiosInstance().put(`/notes/${id}`, {
		title,
		content: document,
	});
	return res.data.data;
};

export const deleteNote = async (id: number): Promise<void> => {
	await axiosInstance().delete(`/notes/${id}`);
};
