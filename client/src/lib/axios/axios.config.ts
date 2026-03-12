import { refreshToken } from "@/services/auth.service";
import axios, {
	AxiosError,
	type AxiosInstance,
	type CreateAxiosDefaults,
} from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
	accessToken = token;
};

const defaultAxiosConfig: CreateAxiosDefaults = {
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
	withCredentials: true, // Include cookies in requests
	timeout: 15000, // 15s — prevents indefinite hang during Render cold starts
	headers: {
		"Content-Type": "application/json",
	},
};

export const staticAxiosInstance = axios.create(defaultAxiosConfig);

const axiosInstance = () => {
	const instance: AxiosInstance = axios.create(defaultAxiosConfig);

	instance.interceptors.request.use((config) => {
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	});

	instance.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as AxiosError["config"] & {
				_retry?: boolean;
			};
			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				const data = await refreshToken();
				if (data && data.data?.accessToken) {
					setAccessToken(data.data?.accessToken);
					originalRequest.headers.Authorization = `Bearer ${data.data?.accessToken}`;
					return instance(originalRequest);
				}
			}
			return Promise.reject(error);
		},
	);

	return instance;
};

export default axiosInstance;
