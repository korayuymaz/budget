"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Plus, BarChart3, User, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Hamburger from "./ui/Hamburger";
import { useState } from "react";

export function Navigation() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const isActive = (path: string) => pathname === path;

	const navItems = [
		{ href: "/", label: "Dashboard", icon: BarChart3 },
		{ href: "/expenses", label: "Expenses", icon: Wallet },
		{ href: "/earnings", label: "Earnings", icon: Plus },
		{ href: "/profile", label: "Profile", icon: User },
	];

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<Link href="/" className="flex items-center space-x-2">
							<Wallet className="h-8 w-8 text-blue-600" />
							<span className="text-xl font-bold text-gray-900">
								Budget Tracker
							</span>
						</Link>

						{session && (
							<div className="hidden md:flex space-x-6">
								{navItems.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.href}
											href={item.href}
											className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
												isActive(item.href)
													? "bg-blue-100 text-blue-700"
													: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
											}`}
										>
											<Icon className="h-4 w-4" />
											<span>{item.label}</span>
										</Link>
									);
								})}
							</div>
						)}
					</div>

					<div className="md:hidden">
						<Hamburger
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							navItems={navItems}
						/>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						{status === "loading" ? (
							<div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
						) : session ? (
							<div className="flex items-center space-x-4">
								<div className="hidden md:flex items-center space-x-2">
									{session.user?.image && (
										<Image
											src={session.user.image}
											alt={session.user.name || "User"}
											width={32}
											height={32}
											className="h-8 w-8 rounded-full"
										/>
									)}
									<span className="text-sm text-gray-700">
										{session.user?.name}
									</span>
								</div>
								<button
									onClick={() => signOut()}
									className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden md:inline">Sign Out</span>
								</button>
							</div>
						) : (
							<button
								onClick={() => signIn("google")}
								className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
							>
								<LogIn className="h-4 w-4" />
								<span>Sign In</span>
							</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
