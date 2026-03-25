"use client";

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

const PLACEHOLDER_IMAGES = [
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
	"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
	"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
	"https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
	"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
	"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
];

export default function StoryCard({ story }: { story: Story }) {
	const imgSrc =
		story.coverImage ||
		PLACEHOLDER_IMAGES[story.id % PLACEHOLDER_IMAGES.length];
	const preview = story.content.replace(/<[^>]*>/g, "").slice(0, 120) + "...";
	const date = story.travelDate
		? new Date(story.travelDate).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: new Date(story.createdAt).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
			});

	return (
		<Link href={`/stories/${story.id}`}>
			<div className="glass rounded-2xl overflow-hidden card-hover cursor-pointer h-full flex flex-col">
				{/* Cover image */}
				<div className="relative h-48 overflow-hidden">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={imgSrc}
						alt={story.title}
						className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
						onError={(e) => {
							(e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES[0];
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					{story.location && (
						<div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
							<span>📍</span> {story.location}
						</div>
					)}
				</div>

				{/* Content */}
				<div className="p-5 flex flex-col flex-1">
					<h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-snug">
						{story.title}
					</h3>
					<p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">
						{preview}
					</p>

					{/* Footer */}
					<div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
						<div className="flex items-center gap-2">
							<div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
								{story.user.username[0].toUpperCase()}
							</div>
							<span className="text-gray-400 text-xs">
								{story.user.username}
							</span>
						</div>
						<span className="text-gray-500 text-xs">{date}</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
