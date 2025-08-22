"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function Dashboard() {
	const { data: session, status } = useSession();

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

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-600 mt-2">
						Welcome back, {session.user?.name}! Here&apos;s your financial
						overview.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Earnings
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">$0.00</div>
						<p className="text-xs text-gray-600">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Expenses
						</CardTitle>
						<TrendingDown className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">$0.00</div>
						<p className="text-xs text-gray-600">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Net Amount</CardTitle>
						<DollarSign className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">$0.00</div>
						<p className="text-xs text-gray-600">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Balance</CardTitle>
						<Wallet className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">$0.00</div>
						<p className="text-xs text-gray-600">Overall</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Recent Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center text-gray-500 py-8">
							<Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No expenses recorded yet</p>
							<p className="text-sm">
								Start tracking your expenses to see them here
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Earnings</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center text-gray-500 py-8">
							<TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No earnings recorded yet</p>
							<p className="text-sm">
								Start tracking your earnings to see them here
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
