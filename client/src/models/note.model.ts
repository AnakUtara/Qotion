import type { Block } from "@blocknote/core";

export default interface INote {
	id: number;
	title: string;
	content: Block[];
	authorId: number;
	createdAt: Date;
	updatedAt: Date;
}
