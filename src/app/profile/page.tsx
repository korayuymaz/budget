"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Currency } from "@/types";
import { User as UserIcon, Settings, Globe } from "lucide-react";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import { UPDATE_USER } from "@/graphql/mutations";
import { UserContext } from "@/components/SessionProvider";

export default function ProfilePage() {
	const { data: session, status } = useSession();
	const userData = useContext(UserContext);
	const {
		data: user,
		loading,
		error,
	} = useQuery(GET_USER_BY_ID, {
		variables: { email: session?.user.email },
	});
	const [saving, setSaving] = useState(false);
	const [preferredCurrency, setPreferredCurrency] = useState<Currency>("USD");

	useEffect(() => {
		if (session) {
			setPreferredCurrency(userData?.user?.preferredCurrency || "USD");
		}
	}, [userData, session]);

	const [updateUser] = useMutation(UPDATE_USER);

	const handleCurrencyChange = async () => {
		setSaving(true);
		updateUser({
			variables: {
				user: {
					preferredCurrency: preferredCurrency,
					id: userData?.user?.id,
				},
			},
		});
		setSaving(false);
	};

	const currencies: { value: Currency; label: string; symbol: string }[] = [
		{ value: "USD", label: "US Dollar", symbol: "$" },
		{ value: "EUR", label: "Euro", symbol: "€" },
		{ value: "GBP", label: "British Pound", symbol: "£" },
		{ value: "TRY", label: "Turkish Lira", symbol: "₺" },
		{ value: "JPY", label: "Japanese Yen", symbol: "¥" },
		{ value: "CAD", label: "Canadian Dollar", symbol: "C$" },
		{ value: "AUD", label: "Australian Dollar", symbol: "A$" },
	];

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!session) {
		redirect("/auth/signin");
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Profile</h1>
					<p className="text-gray-600 mt-2">
						Manage your account settings and preferences
					</p>
				</div>
				<div className="flex items-center justify-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Profile</h1>
					<p className="text-gray-600 mt-2">
						Manage your account settings and preferences
					</p>
				</div>
				<div className="text-center py-8">
					<p className="text-red-600">{error.message}</p>
					<button
						onClick={() => {
							window.location.reload();
						}}
						className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Profile</h1>
				<p className="text-gray-600 mt-2">
					Manage your account settings and preferences
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* User Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<UserIcon className="h-5 w-5" />
							<span>Account Information</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-4">
							{session.user?.image && (
								<Image
									src={session.user.image}
									alt={session.user.name || "User"}
									width={64}
									height={64}
									className="h-16 w-16 rounded-full"
								/>
							)}
							<div>
								<h3 className="text-lg font-medium text-gray-900">
									{session.user?.name || "User"}
								</h3>
								<p className="text-gray-600">{session.user?.email}</p>
							</div>
						</div>
						<div className="pt-4 border-t border-gray-200">
							<p className="text-sm text-gray-600">
								<strong>Google ID:</strong>{" "}
								{user?.googleId || session?.user?.googleId || "N/A"}
							</p>
							<p className="text-sm text-gray-600">
								<strong>Account created:</strong>{" "}
								{user ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
							</p>
							<p className="text-sm text-gray-600">
								<strong>Last updated:</strong>{" "}
								{user ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Preferences */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Settings className="h-5 w-5" />
							<span>Preferences</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								<Globe className="h-4 w-4 inline mr-2" />
								Preferred Currency
							</label>
							<select
								value={preferredCurrency}
								onChange={(e) =>
									setPreferredCurrency(e.target.value as Currency)
								}
								className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								{currencies.map((currency) => (
									<option key={currency.value} value={currency.value}>
										{currency.symbol} {currency.label}
									</option>
								))}
							</select>
							<p className="text-xs text-gray-500 mt-1">
								This currency will be used as the default for new entries
							</p>
						</div>

						<button
							onClick={handleCurrencyChange}
							disabled={
								saving || !user || user.preferredCurrency === preferredCurrency
							}
							className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</CardContent>
				</Card>
			</div>

			{/* Account Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Account Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
							<div>
								<h3 className="font-medium text-yellow-800">Export Data</h3>
								<p className="text-sm text-yellow-600">
									Download your expenses and earnings data
								</p>
							</div>
							<button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
								Export
							</button>
						</div>

						<div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
							<div>
								<h3 className="font-medium text-red-800">Delete Account</h3>
								<p className="text-sm text-red-600">
									Permanently delete your account and all data
								</p>
							</div>
							<button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
								Delete
							</button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
