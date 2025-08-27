import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Budget Tracker",
	description: "Track your expenses and earnings with ease",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<div className="min-h-screen bg-gray-50">
						<Navigation />
						<main className="container mx-auto px-4 py-8">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
