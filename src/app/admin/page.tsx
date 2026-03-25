"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usersApi, storiesApi } from "@/lib/api";
import Link from "next/link";

interface User {
	id: number;
	email: string;
	username: string;
	role: string;
	createdAt: string;
}

interface Story {
	id: number;
	title: string;
	user?: { username: string };
	createdAt: string;
}

interface UserDetail extends User {
	avatar?: string;
	bio?: string;
	stories: Story[];
}

export default function AdminDashboard() {
	const { user, loading: authLoading, refreshUser } = useAuth();
	const router = useRouter();

	const [users, setUsers] = useState<User[]>([]);
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"users" | "stories">("users");
	const [selectedUserDetail, setSelectedUserDetail] =
		useState<UserDetail | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [editFormData, setEditFormData] = useState<{
		username: string;
		avatar: string;
		bio: string;
	}>({ username: "", avatar: "", bio: "" });

	useEffect(() => {
		if (authLoading) return;
		if (!user || user.role !== "ADMIN") {
			router.push("/");
			return;
		}
		fetchData();
	}, [user, authLoading, router]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [usersRes, storiesRes] = await Promise.all([
				usersApi.getAll(),
				storiesApi.getAll(),
			]);
			setUsers(usersRes.data);
			setStories(storiesRes.data);
		} catch (error) {
			console.error("Lỗi khi lấy dữ liệu admin:", error);
			alert("Không thể tải dữ liệu admin. Vui lòng kiểm tra quyền truy cập.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (id: number) => {
		if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
		try {
			await usersApi.delete(id);
			setUsers(users.filter((u) => u.id !== id));
			alert("Đã xóa người dùng");
		} catch (error) {
			console.error(error);
			alert("Lỗi khi xóa người dùng");
		}
	};

	const handleDeleteStory = async (id: number) => {
		if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
		try {
			await storiesApi.delete(id);
			setStories(stories.filter((s) => s.id !== id));
			alert("Đã xóa bài viết");
		} catch (error) {
			console.error(error);
			alert("Lỗi khi xóa bài viết");
		}
	};

	const handleEditUser = async () => {
		if (!selectedUserDetail) return;
		try {
			await usersApi.update(selectedUserDetail.id, editFormData);
			// Update selected user detail locally
			setSelectedUserDetail({
				...selectedUserDetail,
				username: editFormData.username,
				avatar: editFormData.avatar,
				bio: editFormData.bio,
			});
			// Update users list
			setUsers(
				users.map((u) =>
					u.id === selectedUserDetail.id
						? { ...u, username: editFormData.username }
						: u,
				),
			);
			setIsEditMode(false);
			alert("Đã cập nhật thông tin người dùng");
		} catch (error) {
			console.error(error);
			alert("Lỗi cập nhật thông tin người dùng");
		}
	};

	const openEditModal = (userDetail: UserDetail) => {
		setEditFormData({
			username: userDetail.username,
			avatar: userDetail.avatar || "",
			bio: userDetail.bio || "",
		});
		setIsEditMode(true);
	};

	if (authLoading || loading)
		return (
			<div className="text-center py-20 text-gray-400">
				Đang tải cấu hình Admin...
			</div>
		);
	if (!user || user.role !== "ADMIN") return null;

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<div className="flex items-center gap-4 mb-8">
				<h1 className="text-3xl font-bold gradient-text">Quản Trị Hệ Thống</h1>
				<span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
					ADMIN MODE
				</span>
			</div>

			<div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
				<button
					onClick={() => setActiveTab("users")}
					className={`px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === "users" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-amber-400"}`}>
					Quản lý Người dùng ({users.length})
				</button>
				<button
					onClick={() => setActiveTab("stories")}
					className={`px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === "stories" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-amber-400"}`}>
					Quản lý Bài viết ({stories.length})
				</button>
			</div>

			<div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass">
				{activeTab === "users" ? (
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-white/10 text-gray-400 p-4 bg-black/20 text-sm uppercase">
									<th className="p-4">ID</th>
									<th className="p-4">Email</th>
									<th className="p-4">Username</th>
									<th className="p-4">Vai trò</th>
									<th className="p-4">Hành động</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr
										key={u.id}
										className="border-b border-white/5 hover:bg-white/5 transition-colors">
										<td className="p-4 text-gray-400">#{u.id}</td>
										<td className="p-4">{u.email}</td>
										<td className="p-4 font-semibold text-amber-200">
											{u.username}
										</td>
										<td className="p-4">
											{u.role === "ADMIN" ? (
												<span className="text-red-400 text-xs px-2 py-1 bg-red-500/20 rounded-md">
													ADMIN
												</span>
											) : (
												<span className="text-blue-400 text-xs px-2 py-1 bg-blue-500/20 rounded-md">
													USER
												</span>
											)}
										</td>
										<td className="p-4">
											{u.id !== user.id && (
												<div className="flex items-center gap-2">
													<button
														onClick={async () => {
															const newRole =
																u.role === "ADMIN" ? "USER" : "ADMIN";
															if (
																!confirm(`Chuyển người này thành ${newRole}?`)
															)
																return;
															try {
																await usersApi.updateRole(u.id, newRole);
																setUsers(
																	users.map((usr) =>
																		usr.id === u.id
																			? { ...usr, role: newRole }
																			: usr,
																	),
																);
																// ✅ FIX: Refresh auth context if current user's role changed
																// This ensures the admin sees updated role immediately
																if (user?.id === u.id) {
																	await refreshUser();
																}
															} catch (error) {
																console.error(error);
																alert("Lỗi cập nhật quyền");
															}
														}}
														className="text-amber-400 hover:text-amber-300 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded transition-colors text-sm">
														{u.role === "ADMIN" ? "Giáng quyền" : "Thăng cấp"}
													</button>
													<button
														onClick={async () => {
															try {
																const res = await usersApi.getOne(u.id);
																setSelectedUserDetail(res.data);
															} catch {
																alert("Không thể lấy thông tin chi tiết");
															}
														}}
														className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded transition-colors text-sm">
														Chi tiết
													</button>
													<button
														onClick={() => handleDeleteUser(u.id)}
														className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors text-sm">
														Xóa
													</button>
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-white/10 text-gray-400 p-4 bg-black/20 text-sm uppercase">
									<th className="p-4">ID</th>
									<th className="p-4">Tiêu đề bài viết</th>
									<th className="p-4">Tác giả</th>
									<th className="p-4">Ngày tạo</th>
									<th className="p-4">Hành động</th>
								</tr>
							</thead>
							<tbody>
								{stories.map((s) => (
									<tr
										key={s.id}
										className="border-b border-white/5 hover:bg-white/5 transition-colors">
										<td className="p-4 text-gray-400">#{s.id}</td>
										<td className="p-4">
											<Link
												href={`/stories/${s.id}`}
												className="hover:text-amber-400 transition-colors font-medium">
												{s.title}
											</Link>
										</td>
										<td className="p-4 text-amber-200/70">
											{s.user?.username || "Unknown"}
										</td>
										<td className="p-4 text-gray-400 text-sm">
											{new Date(s.createdAt).toLocaleDateString()}
										</td>
										<td className="p-4">
											<button
												onClick={() => handleDeleteStory(s.id)}
												className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors text-sm">
												Xóa
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{selectedUserDetail && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
					<div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl w-full max-w-lg relative">
						<button
							onClick={() => {
								setSelectedUserDetail(null);
								setIsEditMode(false);
							}}
							className="absolute top-4 right-4 text-gray-400 hover:text-white">
							✕
						</button>
						<h2 className="text-2xl font-bold mb-4 gradient-text">
							Chi tiết Người dùng #{selectedUserDetail.id}
						</h2>

						{!isEditMode ? (
							<>
								<div className="space-y-3 text-gray-300">
									<p>
										<strong>Email:</strong> {selectedUserDetail.email}
									</p>
									<p>
										<strong>Username:</strong> {selectedUserDetail.username}
									</p>
									<p>
										<strong>Ngày tham gia:</strong>{" "}
										{new Date(selectedUserDetail.createdAt).toLocaleString()}
									</p>
									<p>
										<strong>Giới thiệu (Bio):</strong>{" "}
										{selectedUserDetail.bio || "Chưa cập nhật"}
									</p>
									<p>
										<strong>Số lượng bài viết đã đăng:</strong>{" "}
										{selectedUserDetail.stories?.length || 0}
									</p>

									{selectedUserDetail.stories?.length > 0 && (
										<div className="mt-4 border-t border-white/10 pt-4">
											<h3 className="font-semibold mb-2">Các bài viết:</h3>
											<ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
												{selectedUserDetail.stories.map((s: Story) => (
													<li key={s.id}>
														<Link
															href={`/stories/${s.id}`}
															className="hover:text-amber-400">
															{s.title}
														</Link>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
								<div className="mt-6 flex gap-2 justify-end">
									<button
										onClick={() => openEditModal(selectedUserDetail)}
										className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors">
										Chỉnh sửa
									</button>
									<button
										onClick={() => setSelectedUserDetail(null)}
										className="btn-ghost">
										Đóng
									</button>
								</div>
							</>
						) : (
							<>
								<form className="space-y-4">
									<div>
										<label className="block text-sm font-semibold text-gray-300 mb-1">
											Username
										</label>
										<input
											type="text"
											value={editFormData.username}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													username: e.target.value,
												})
											}
											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
											placeholder="Username"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-300 mb-1">
											Avatar URL
										</label>
										<input
											type="text"
											value={editFormData.avatar}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													avatar: e.target.value,
												})
											}
											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
											placeholder="Avatar URL"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-300 mb-1">
											Bio (Giới thiệu)
										</label>
										<textarea
											value={editFormData.bio}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													bio: e.target.value,
												})
											}
											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
											placeholder="Bio"
											rows={3}
										/>
									</div>
								</form>
								<div className="mt-6 flex gap-2 justify-end">
									<button
										onClick={handleEditUser}
										className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-500 transition-colors">
										Lưu
									</button>
									<button
										onClick={() => setIsEditMode(false)}
										className="px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500 transition-colors">
										Hủy
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
