"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EarningForm } from "@/components/EarningForm";
import { EarningList } from "@/components/EarningList";
import { TrendingUp, Plus } from "lucide-react";

export default function EarningsPage() {
	const { data: session, status } = useSession();
	const [showForm, setShowForm] = useState(false);

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
					<h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
					<p className="text-gray-600 mt-2">Track your income and earnings</p>
				</div>
				<button
					onClick={() => setShowForm(!showForm)}
					className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
				>
					<Plus className="h-4 w-4" />
					<span>Add Earning</span>
				</button>
			</div>

			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<TrendingUp className="h-5 w-5" />
							<span>Add New Earning</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<EarningForm onSuccess={() => setShowForm(false)} />
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Your Earnings</CardTitle>
				</CardHeader>
				<CardContent>
					<EarningList />
				</CardContent>
			</Card>
		</div>
	);
}
