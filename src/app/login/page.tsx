"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
	const { login } = useAuth();
	const router = useRouter();
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await login(form.email, form.password);
			router.push("/");
		} catch (err: unknown) {
			const axiosErr = err as { response?: { data?: { message?: string } } };
			setError(
				axiosErr.response?.data?.message || "Email hoặc mật khẩu không đúng",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md animate-fade-in">
				{/* Card */}
				<div className="glass rounded-3xl p-8">
					<div className="text-center mb-8">
						<div className="text-5xl mb-3">✈️</div>
						<h1 className="text-2xl font-bold text-white">
							Chào mừng trở lại!
						</h1>
						<p className="text-gray-400 mt-1 text-sm">
							Đăng nhập để tiếp tục hành trình
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Email
							</label>
							<input
								id="login-email"
								type="email"
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								placeholder="you@example.com"
								className="input-field"
								required
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Mật khẩu
							</label>
							<input
								id="login-password"
								type="password"
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
								placeholder="••••••••"
								className="input-field"
								required
							/>
						</div>

						{error && (
							<div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3">
								{error}
							</div>
						)}

						<button
							id="login-submit"
							type="submit"
							disabled={loading}
							className="btn-primary w-full py-3 text-base mt-2">
							{loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
						</button>
					</form>

					<p className="text-center text-gray-500 text-sm mt-6">
						Chưa có tài khoản?{" "}
						<Link
							href="/register"
							className="text-amber-400 hover:text-amber-300 font-medium">
							Đăng ký ngay
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
