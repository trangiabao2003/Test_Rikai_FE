"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { storiesApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function NewStoryPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [form, setForm] = useState({
		title: "",
		content: "",
		location: "",
		coverImage: "",
		travelDate: "",
	});
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	if (!authLoading && !user) {
		router.push("/login");
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSaving(true);
		try {
			const payload = {
				title: form.title,
				content: form.content,
				location: form.location || undefined,
				coverImage: form.coverImage || undefined,
				travelDate: form.travelDate || undefined,
			};
			const res = await storiesApi.create(payload);
			router.push(`/stories/${res.data.id}`);
		} catch (err: unknown) {
			const axiosErr = err as {
				response?: { data?: { message?: string | string[] } };
			};
			const msg = axiosErr.response?.data?.message;
			setError(Array.isArray(msg) ? msg[0] : msg || "Có lỗi xảy ra");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
			<Link
				href="/"
				className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-6 text-sm">
				← Quay lại
			</Link>

			<div className="glass rounded-3xl p-8">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-white mb-1">
						✈️ Viết câu chuyện mới
					</h1>
					<p className="text-gray-400 text-sm">
						Chia sẻ những kỷ niệm từ chuyến đi của bạn
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm text-gray-400 mb-1.5">
							Tiêu đề *
						</label>
						<input
							id="story-title"
							type="text"
							value={form.title}
							onChange={(e) => setForm({ ...form, title: e.target.value })}
							placeholder="Tên chuyến đi hoặc câu chuyện..."
							className="input-field"
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Địa điểm
							</label>
							<input
								id="story-location"
								type="text"
								value={form.location}
								onChange={(e) => setForm({ ...form, location: e.target.value })}
								placeholder="Hà Nội, Đà Nẵng..."
								className="input-field"
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Ngày du lịch
							</label>
							<input
								id="story-travel-date"
								type="date"
								value={form.travelDate}
								onChange={(e) =>
									setForm({ ...form, travelDate: e.target.value })
								}
								className="input-field"
								style={{ colorScheme: "dark" }}
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm text-gray-400 mb-1.5">
							URL ảnh bìa
						</label>
						<input
							id="story-cover"
							type="url"
							value={form.coverImage}
							onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
							placeholder="https://..."
							className="input-field"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400 mb-1.5">
							Nội dung *
						</label>
						<textarea
							id="story-content"
							value={form.content}
							onChange={(e) => setForm({ ...form, content: e.target.value })}
							placeholder="Kể lại câu chuyện chuyến đi của bạn..."
							className="input-field resize-none"
							rows={12}
							required
						/>
					</div>

					{error && (
						<div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3">
							{error}
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<button
							id="story-submit"
							type="submit"
							disabled={saving}
							className="btn-primary flex-1 py-3">
							{saving ? "⏳ Đang lưu..." : "🚀 Đăng câu chuyện"}
						</button>
						<Link href="/" className="btn-ghost px-6 py-3 text-center">
							Hủy
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
