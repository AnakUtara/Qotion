import { createContext } from "react";

export interface IUser {
	id: string;
	email: string;
}

export interface IAuthResponse {
	user: IUser;
	accessToken: string;
}

export interface AuthContextProps {
	user: IUser | null;
	isLoading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithGoogle: (idToken: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	persistUser: () => Promise<void>;
	signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
	undefined,
);
