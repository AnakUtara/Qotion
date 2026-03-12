import axiosInstance from "@/lib/axios/axios.config";
import type { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
	timeout: 0,
};

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);

	const res = await axiosInstance().post<{ data: { url: string } }>(
		"/cloudinary-storage/image",
		formData,
		config,
	);
	return res.data.data.url;
};

export const uploadFile = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	const res = await axiosInstance().post<{ data: { url: string } }>(
		"/cloudinary-storage/file",
		formData,
		config,
	);
	return res.data.data.url;
};
