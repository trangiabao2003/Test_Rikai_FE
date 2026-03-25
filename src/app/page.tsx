"use client";

import { useEffect, useState } from "react";
import { storiesApi } from "@/lib/api";
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

export default function HomePage() {
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		storiesApi
			.getAll()
			.then((res) => setStories(res.data))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="max-w-6xl mx-auto px-4 py-10">
			{/* Hero */}
			<section className="text-center mb-16 animate-fade-in">
				<div className="text-6xl mb-4">🌍</div>
				<h1 className="text-5xl font-bold mb-4">
					<span className="gradient-text">Những chuyến đi</span>
					<br />
					<span className="text-white">đáng nhớ nhất</span>
				</h1>
				<p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
					Ghi lại mọi kỷ niệm từ những hành trình khám phá thế giới của bạn.
					Chia sẻ những câu chuyện, cảm xúc và khoảnh khắc đặc biệt.
				</p>
				<Link
					href="/stories/new"
					className="btn-primary inline-block px-8 py-3 text-base">
					✈️ Bắt đầu viết
				</Link>
			</section>

			{/* Stories grid */}
			<section>
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl font-bold text-white">Câu chuyện mới nhất</h2>
					<span className="text-gray-500 text-sm">
						{stories.length} câu chuyện
					</span>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="h-72 rounded-2xl bg-white/5 animate-pulse"
							/>
						))}
					</div>
				) : stories.length === 0 ? (
					<div className="text-center py-20">
						<div className="text-5xl mb-4">🗺️</div>
						<p className="text-gray-500 text-lg">
							Chưa có câu chuyện nào. Hãy là người đầu tiên!
						</p>
						<Link href="/register" className="btn-primary inline-block mt-6">
							Đăng ký ngay
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{stories.map((story, i) => (
							<div
								key={story.id}
								className="animate-fade-in"
								style={{ animationDelay: `${i * 0.07}s` }}>
								<StoryCard story={story} />
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
