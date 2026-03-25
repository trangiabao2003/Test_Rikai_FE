"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { storiesApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EditStoryPage() {
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	const router = useRouter();
	const [form, setForm] = useState({
		title: "",
		content: "",
		location: "",
		coverImage: "",
		travelDate: "",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		storiesApi
			.getOne(Number(id))
			.then((res) => {
				const s = res.data;
				if (user && user.id !== s.user.id) {
					router.push("/");
					return;
				}
				setForm({
					title: s.title,
					content: s.content,
					location: s.location || "",
					coverImage: s.coverImage || "",
					travelDate: s.travelDate ? s.travelDate.split("T")[0] : "",
				});
			})
			.catch(() => router.push("/"))
			.finally(() => setLoading(false));
	}, [id, user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		try {
			await storiesApi.update(Number(id), {
				title: form.title,
				content: form.content,
				location: form.location || undefined,
				coverImage: form.coverImage || undefined,
				travelDate: form.travelDate || undefined,
			});
			router.push(`/stories/${id}`);
		} catch (err: unknown) {
			const axiosErr = err as { response?: { data?: { message?: string } } };
			setError(axiosErr.response?.data?.message || "Cập nhật thất bại");
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="max-w-2xl mx-auto px-4 py-10 animate-pulse">
				<div className="glass rounded-3xl p-8 space-y-4">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="h-10 bg-white/5 rounded-xl" />
					))}
				</div>
			</div>
		);

	return (
		<div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
			<Link
				href={`/stories/${id}`}
				className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-6 text-sm">
				← Quay lại
			</Link>

			<div className="glass rounded-3xl p-8">
				<h1 className="text-2xl font-bold text-white mb-6">
					✏️ Chỉnh sửa câu chuyện
				</h1>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm text-gray-400 mb-1.5">
							Tiêu đề *
						</label>
						<input
							type="text"
							value={form.title}
							onChange={(e) => setForm({ ...form, title: e.target.value })}
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
								type="text"
								value={form.location}
								onChange={(e) => setForm({ ...form, location: e.target.value })}
								className="input-field"
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-400 mb-1.5">
								Ngày du lịch
							</label>
							<input
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
							type="url"
							value={form.coverImage}
							onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
							className="input-field"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400 mb-1.5">
							Nội dung *
						</label>
						<textarea
							value={form.content}
							onChange={(e) => setForm({ ...form, content: e.target.value })}
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

					<div className="flex gap-3">
						<button
							type="submit"
							disabled={saving}
							className="btn-primary flex-1 py-3">
							{saving ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
						</button>
						<Link
							href={`/stories/${id}`}
							className="btn-ghost px-6 py-3 text-center">
							Hủy
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
