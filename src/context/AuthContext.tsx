"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	ReactNode,
} from "react";
import { authApi } from "@/lib/api";
import axios from "axios";
interface User {
	id: number;
	email: string;
	username: string;
	avatar?: string;
	bio?: string;
	role: "USER" | "ADMIN";
	createdAt: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshUser = useCallback(async () => {
		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				setUser(null);
				setLoading(false);
				return;
			}
			const res = await authApi.me();
			setUser(res.data);
		} catch (error: unknown) {
			// Only logout if token is invalid (401)
			// For other errors (network, server), keep user logged in
			const isUnauthorized =
				axios.isAxiosError(error) && error.response?.status === 401;
			if (isUnauthorized) {
				localStorage.removeItem("access_token");
				setUser(null);
			} else {
				console.warn("Failed to refresh user:", error);
			}
			// For 5xx, network errors, etc. -> silently fail and keep user logged in
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshUser();
	}, []);

	const login = async (email: string, password: string) => {
		const res = await authApi.login({ email, password });
		localStorage.setItem("access_token", res.data.access_token);
		setUser(res.data.user);
	};

	const logout = () => {
		localStorage.removeItem("access_token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be inside AuthProvider");
	return ctx;
}
