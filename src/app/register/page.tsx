"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
	const { refreshUser } = useAuth();
	const router = useRouter();
	const [form, setForm] = useState({ email: "", username: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await authApi.register(form);
			localStorage.setItem("access_token", res.data.access_token);
			await refreshUser();
			router.push("/");
		} catch (err: unknown) {
			const axiosErr = err as {
				response?: { data?: { message?: string | string[] } };
			};
			const msg = axiosErr.response?.data?.message;
			setError(Array.isArray(msg) ? msg[0] : msg || "Đăng ký thất bại");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md animate-fade-in">
				<div className="glass rounded-3xl p-8">
					<div className="text-center mb-8">
						<div className="text-5xl mb-3">🌏</div>
						<h1 className="text-2xl font-bold text-white">
							Bắt đầu hành trình
						</h1>
						<p className="text-gray-400 mt-1 text-sm">
							Tạo tài khoản để lưu giữ kỷ niệm
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Tên hiển thị
							</label>
							<input
								id="register-username"
								type="text"
								value={form.username}
								onChange={(e) => setForm({ ...form, username: e.target.value })}
								placeholder="Tên của bạn"
								className="input-field"
								required
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Email
							</label>
							<input
								id="register-email"
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
								id="register-password"
								type="password"
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
								placeholder="Ít nhất 6 ký tự"
								className="input-field"
								minLength={6}
								required
							/>
						</div>

						{error && (
							<div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3">
								{error}
							</div>
						)}

						<button
							id="register-submit"
							type="submit"
							disabled={loading}
							className="btn-primary w-full py-3 text-base mt-2">
							{loading ? "⏳ Đang tạo tài khoản..." : "Đăng ký"}
						</button>
					</form>

					<p className="text-center text-gray-500 text-sm mt-6">
						Đã có tài khoản?{" "}
						<Link
							href="/login"
							className="text-amber-400 hover:text-amber-300 font-medium">
							Đăng nhập
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
