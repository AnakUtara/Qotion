import z from "zod/v4";

// We define a base schema first
const baseBlockSchema = z.object({
	id: z.string(),
	type: z.string(),
	props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
	// Content can be an array of rich text objects or undefined
	content: z.union([z.array(z.any()), z.any()]).optional(),
});

// Since BlockNote is recursive (children: Block[]), we use z.lazy
export const blockSchema: z.ZodType<any> = baseBlockSchema.extend({
	children: z.lazy(() => z.array(blockSchema)),
});

// This is the schema for the entire document (an array of blocks)
export const blockNoteDocSchema = z.array(blockSchema);

const sharedNotesSchema = {
	title: z
		.string()
		.trim()
		.min(2, "Title must be at least 2 characters")
		.max(500, "Title must be at most 500 characters"),
	content: blockNoteDocSchema,
};

export const createNoteSchema = z.object({
	...sharedNotesSchema,
});

export const updateNoteSchema = z.object({
	...sharedNotesSchema,
	title: sharedNotesSchema.title.optional(),
	content: sharedNotesSchema.content.optional(),
});
