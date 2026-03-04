import yup from "../libs/yup";

const sharedPostSchema = {
	title: yup.string().trim().min(2).required("Title is required"),
	content: yup
		.string()
		.trim()
		.min(10)
		.max(1000)
		.required("Content is required"),
	userId: yup.number().required("User ID is required").positive().integer(),
	publishedAt: yup.date().nullable(),
};

export const createPostSchema = yup.object().shape({
	...sharedPostSchema,
});

export const updatePostSchema = yup.object().shape({
	...sharedPostSchema,
	title: yup.string().trim().min(2).optional(),
	content: yup.string().trim().min(10).max(1000).optional(),
});
