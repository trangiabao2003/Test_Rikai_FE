import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Wanderlust – Travel Story Journal",
	description: "Lưu giữ những câu chuyện và kỷ niệm từ mọi chuyến hành trình.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="vi">
			<body className={outfit.className}>
				<AuthProvider>
					<Navbar />
					<main className="min-h-screen">{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}
