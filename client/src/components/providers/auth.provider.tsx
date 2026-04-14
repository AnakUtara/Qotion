import {
	AuthContext,
	type IAuthResponse,
	type IUser,
} from "@/context/auth.context";
import { setAccessToken } from "@/lib/axios/axios.config";
import {
	googleLogin,
	login,
	logout,
	refreshToken,
	register,
} from "@/services/auth.service";
import {
	useEffect,
	useRef,
	useState,
	type ComponentProps,
	type ReactNode,
} from "react";

const AuthProvider = ({
	children,
}: ComponentProps<"div"> & { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const signIn = async (email: string, password: string) => {
		const res = await login(email, password);
		const { data }: { data: IAuthResponse } = res;
		setUser(data.user);
		setAccessToken(data.accessToken);
	};

	const signInWithGoogle = async (idToken: string) => {
		const res = await googleLogin(idToken);
		const { data }: { data: IAuthResponse } = res;
		setUser(data.user);
		setAccessToken(data.accessToken);
	};

	const signUp = async (email: string, password: string) => {
		await register(email, password);
	};

	const isRefreshing = useRef(false);

	const persistUser = async () => {
		if (isRefreshing.current) return;
		isRefreshing.current = true;
		setIsLoading(true);
		try {
			const res = await refreshToken();
			const { data }: { data: IAuthResponse } = res;
			setUser(data.user);
			setAccessToken(data.accessToken);
		} catch {
			setUser(null);
			setAccessToken(null);
		} finally {
			setIsLoading(false);
			isRefreshing.current = false;
		}
	};

	const signOut = async () => {
		setIsLoading(true);
		try {
			await logout();
			setUser(null);
			setAccessToken(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		persistUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				signIn,
				signInWithGoogle,
				signUp,
				persistUser,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
