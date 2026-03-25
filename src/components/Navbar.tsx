"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<nav className="glass sticky top-0 z-50 border-b border-white/5">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<span className="text-2xl">🧳</span>
					<span className="text-xl font-bold gradient-text">Wanderlust</span>
				</Link>

				{/* Desktop nav */}
				<div className="hidden md:flex items-center gap-4">
					<Link
						href="/"
						className="text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium">
						Khám phá
					</Link>
					{user ? (
						<>
							<Link
								href="/stories/new"
								className="btn-primary text-sm px-4 py-2">
								+ Viết câu chuyện
							</Link>
							{user.role === "ADMIN" && (
								<Link
									href="/admin"
									className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
									🔒 Admin Panel
								</Link>
							)}
							<Link
								href="/profile"
								className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors">
								<div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm font-bold">
									{user.username[0].toUpperCase()}
								</div>
							</Link>
							<button onClick={handleLogout} className="btn-ghost text-sm">
								Đăng xuất
							</button>
						</>
					) : (
						<>
							<Link href="/login" className="btn-ghost text-sm">
								Đăng nhập
							</Link>
							<Link href="/register" className="btn-primary text-sm">
								Đăng ký
							</Link>
						</>
					)}
				</div>

				{/* Mobile menu button */}
				<button
					className="md:hidden text-gray-400"
					onClick={() => setMenuOpen(!menuOpen)}>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
						/>
					</svg>
				</button>
			</div>

			{/* Mobile dropdown */}
			{menuOpen && (
				<div className="md:hidden px-4 pb-4 flex flex-col gap-3">
					<Link
						href="/"
						onClick={() => setMenuOpen(false)}
						className="text-gray-400 py-2">
						Khám phá
					</Link>
					{user ? (
						<>
							<Link
								href="/stories/new"
								onClick={() => setMenuOpen(false)}
								className="btn-primary text-center">
								+ Viết câu chuyện
							</Link>
							{user.role === "ADMIN" && (
								<Link
									href="/admin"
									onClick={() => setMenuOpen(false)}
									className="text-red-400 text-center py-2">
									🔒 Admin Panel
								</Link>
							)}
							<Link
								href="/profile"
								onClick={() => setMenuOpen(false)}
								className="text-gray-400 py-2">
								Hồ sơ
							</Link>
							<button onClick={handleLogout} className="btn-ghost">
								Đăng xuất
							</button>
						</>
					) : (
						<>
							<Link
								href="/login"
								onClick={() => setMenuOpen(false)}
								className="btn-ghost text-center">
								Đăng nhập
							</Link>
							<Link
								href="/register"
								onClick={() => setMenuOpen(false)}
								className="btn-primary text-center">
								Đăng ký
							</Link>
						</>
					)}
				</div>
			)}
		</nav>
	);
}
