"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { storiesApi, usersApi } from "@/lib/api";
import StoryCard from "@/components/StoryCard";
import Link from "next/link";

interface Story {
	id: number;
	title: string;
	content: string;
	location?: string;
	coverImage?: string;
	travelDate?: string;
	createdAt: string;
	user: { id: number; username: string; avatar?: string };
}

export default function ProfilePage() {
	const { user, loading: authLoading, logout, refreshUser } = useAuth();
	const router = useRouter();
	const [stories, setStories] = useState<Story[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({ username: "", bio: "", avatar: "" });
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
			return;
		}
		if (user) {
			setForm({
				username: user.username,
				bio: user.bio || "",
				avatar: user.avatar || "",
			});
			storiesApi.getAll().then((res) => {
				setStories(res.data.filter((s: Story) => s.user.id === user.id));
			});
		}
	}, [user, authLoading, router]);

	const handleSave = async () => {
		if (!user) return;
		setSaving(true);
		try {
			const res = await usersApi.update(user.id, {
				username: form.username,
				bio: form.bio || undefined,
				avatar: form.avatar || undefined,
			});
			// Update UI immediately with API response data
			setForm({
				username: res.data.username,
				bio: res.data.bio || "",
				avatar: res.data.avatar || "",
			});
			setEditMode(false);
			// Then refresh from server to sync all contexts
			await refreshUser();
		} catch (error) {
			console.error("Update error:", error);
			alert("Lỗi khi cập nhật hồ sơ");
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || !user)
		return (
			<div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
				<div className="h-32 bg-white/5 rounded-2xl mb-6" />
			</div>
		);

	return (
		<div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
			{/* Profile card */}
			<div className="glass rounded-3xl p-8 mb-10">
				<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
					{/* Avatar */}
					<div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 text-3xl font-bold flex-shrink-0">
						{user.username[0].toUpperCase()}
					</div>

					<div className="flex-1">
						{editMode ? (
							<div className="space-y-3">
								<input
									value={form.username}
									onChange={(e) =>
										setForm({ ...form, username: e.target.value })
									}
									placeholder="Tên hiển thị"
									className="input-field"
								/>
								<input
									value={form.bio}
									onChange={(e) => setForm({ ...form, bio: e.target.value })}
									placeholder="Giới thiệu bản thân..."
									className="input-field"
								/>
								<input
									value={form.avatar}
									onChange={(e) => setForm({ ...form, avatar: e.target.value })}
									placeholder="URL ảnh đại diện"
									className="input-field"
								/>
								<div className="flex gap-2">
									<button
										onClick={handleSave}
										disabled={saving}
										className="btn-primary px-4 py-2 text-sm">
										{saving ? "Đang lưu..." : "💾 Lưu"}
									</button>
									<button
										onClick={() => setEditMode(false)}
										className="btn-ghost px-4 py-2 text-sm">
										Hủy
									</button>
								</div>
							</div>
						) : (
							<>
								<h1 className="text-2xl font-bold text-white">
									{user.username}
								</h1>
								<p className="text-gray-500 text-sm mb-1">{user.email}</p>
								{user.bio && (
									<p className="text-gray-400 text-sm mt-2">{user.bio}</p>
								)}
								<p className="text-gray-600 text-xs mt-2">
									Tham gia{" "}
									{new Date(user.createdAt).toLocaleDateString("vi-VN", {
										year: "numeric",
										month: "long",
									})}
								</p>
							</>
						)}
					</div>

					{!editMode && (
						<div className="flex gap-2">
							<button
								onClick={() => setEditMode(true)}
								className="btn-ghost text-sm">
								✏️ Sửa hồ sơ
							</button>
							<button
								onClick={() => {
									logout();
									router.push("/");
								}}
								className="btn-ghost text-sm text-red-400 border-red-500/20">
								Đăng xuất
							</button>
						</div>
					)}
				</div>

				{/* Stats */}
				<div className="flex gap-6 mt-6 pt-6 border-t border-white/5">
					<div className="text-center">
						<p className="text-2xl font-bold text-amber-400">
							{stories.length}
						</p>
						<p className="text-gray-500 text-xs">Câu chuyện</p>
					</div>
				</div>
			</div>

			{/* My stories */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-white">Câu chuyện của tôi</h2>
					<Link href="/stories/new" className="btn-primary text-sm px-4 py-2">
						+ Viết mới
					</Link>
				</div>

				{stories.length === 0 ? (
					<div className="text-center py-16 glass rounded-2xl">
						<div className="text-4xl mb-3">✍️</div>
						<p className="text-gray-500">Bạn chưa có câu chuyện nào.</p>
						<Link
							href="/stories/new"
							className="btn-primary inline-block mt-4 text-sm">
							Viết câu chuyện đầu tiên
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{stories.map((story) => (
							<StoryCard key={story.id} story={story} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
