"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { storiesApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Story {
	id: number;
	title: string;
	content: string;
	location?: string;
	coverImage?: string;
	travelDate?: string;
	createdAt: string;
	updatedAt: string;
	user: { id: number; username: string; avatar?: string };
}

const PLACEHOLDER_IMAGES = [
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
	"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
	"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
];

export default function StoryDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { user } = useAuth();
	const [story, setStory] = useState<Story | null>(null);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		storiesApi
			.getOne(Number(id))
			.then((res) => setStory(res.data))
			.catch(() => router.push("/"))
			.finally(() => setLoading(false));
	}, [id, router]);

	const handleDelete = async () => {
		if (!confirm("Bạn có chắc muốn xóa câu chuyện này không?")) return;
		setDeleting(true);
		try {
			await storiesApi.delete(Number(id));
			router.push("/");
		} catch {
			setDeleting(false);
		}
	};

	if (loading)
		return (
			<div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
				<div className="h-72 rounded-2xl bg-white/5 mb-8" />
				<div className="h-8 bg-white/5 rounded mb-4 w-3/4" />
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="h-4 bg-white/5 rounded" />
					))}
				</div>
			</div>
		);

	if (!story) return null;

	const isOwner = user?.id === story.user.id;
	const coverImg =
		story.coverImage ||
		PLACEHOLDER_IMAGES[story.id % PLACEHOLDER_IMAGES.length];
	const travelDate = story.travelDate
		? new Date(story.travelDate).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: null;

	return (
		<div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
			{/* Back */}
			<Link
				href="/"
				className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-6 text-sm">
				← Quay lại
			</Link>

			{/* Cover */}
			<div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={coverImg}
					alt={story.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
				{story.location && (
					<div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
						📍 {story.location}
					</div>
				)}
			</div>

			{/* Header */}
			<div className="mb-6">
				{travelDate && (
					<div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
						<span>🗓️</span> {travelDate}
					</div>
				)}
				<h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
					{story.title}
				</h1>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
							{story.user.username[0].toUpperCase()}
						</div>
						<div>
							<p className="text-white text-sm font-medium">
								{story.user.username}
							</p>
							<p className="text-gray-500 text-xs">
								{new Date(story.createdAt).toLocaleDateString("vi-VN")}
							</p>
						</div>
					</div>

					{isOwner && (
						<div className="flex gap-2">
							<Link
								href={`/stories/${story.id}/edit`}
								className="btn-ghost text-sm px-3 py-1.5">
								✏️ Chỉnh sửa
							</Link>
							<button
								onClick={handleDelete}
								disabled={deleting}
								className="text-sm px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
								{deleting ? "⏳" : "🗑️ Xóa"}
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Divider */}
			<div className="border-t border-white/5 mb-6" />

			{/* Content */}
			<div className="prose prose-invert max-w-none">
				<div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
					{story.content}
				</div>
			</div>
		</div>
	);
}
