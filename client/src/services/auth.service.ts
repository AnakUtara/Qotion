import axiosInstance, { staticAxiosInstance } from "@/lib/axios/axios.config";

export const login = async (email: string, password: string) => {
	const res = await staticAxiosInstance.post("/auth/login", {
		email,
		password,
	});
	return res.data;
};

export const googleLogin = async (idToken: string) => {
	const res = await staticAxiosInstance.post("/auth/google/callback", {
		idToken,
	});
	return res.data;
};

export const register = async (email: string, password: string) => {
	await staticAxiosInstance.post("/auth/register", { email, password });
};

export const logout = async () => {
	await axiosInstance().post("/auth/logout");
};

export const refreshToken = async () => {
	const res = await staticAxiosInstance.post("/auth/refresh-token");
	return res.data;
};
