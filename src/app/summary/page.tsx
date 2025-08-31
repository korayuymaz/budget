"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiService } from "@/services/api";
import { Summary } from "@/types";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import Loading from "@/components/ui/Loading";

export default function SummaryPage() {
	const { data: session, status } = useSession();
	const [summary, setSummary] = useState<Summary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (session) {
			loadSummary();
		}
	}, [session]);

	const loadSummary = async () => {
		try {
			setLoading(true);
			const data = await apiService.getSummary();
			setSummary(data);
		} catch (err) {
			setError("Failed to load summary");
			console.error("Error loading summary:", err);
		} finally {
			setLoading(false);
		}
	};

	const getCurrencySymbol = (currency: string) => {
		const symbols: Record<string, string> = {
			USD: "$",
			EUR: "€",
			GBP: "£",
			TRY: "₺",
			JPY: "¥",
			CAD: "C$",
			AUD: "A$",
		};
		return symbols[currency] || currency;
	};

	if (status === "loading") {
		return <Loading />;
	}

	if (!session) {
		redirect("/auth/signin");
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Financial Summary
					</h1>
					<p className="text-gray-600 mt-2">
						Overview of your earnings, expenses, and net amount
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
					<h1 className="text-3xl font-bold text-gray-900">
						Financial Summary
					</h1>
					<p className="text-gray-600 mt-2">
						Overview of your earnings, expenses, and net amount
					</p>
				</div>
				<div className="text-center py-8">
					<p className="text-red-600">{error}</p>
					<button
						onClick={loadSummary}
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
				<h1 className="text-3xl font-bold text-gray-900">Financial Summary</h1>
				<p className="text-gray-600 mt-2">
					Overview of your earnings, expenses, and net amount
				</p>
			</div>

			{summary ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Earnings
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-green-600" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-green-600">
									{getCurrencySymbol(summary.currency)}
									{summary.totalEarnings.toFixed(2)}
								</div>
								<p className="text-xs text-gray-600">All time</p>
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
								<div className="text-2xl font-bold text-red-600">
									{getCurrencySymbol(summary.currency)}
									{summary.totalExpenses.toFixed(2)}
								</div>
								<p className="text-xs text-gray-600">All time</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Net Amount
								</CardTitle>
								<DollarSign className="h-4 w-4 text-blue-600" />
							</CardHeader>
							<CardContent>
								<div
									className={`text-2xl font-bold ${
										summary.netAmount >= 0 ? "text-blue-600" : "text-red-600"
									}`}
								>
									{getCurrencySymbol(summary.currency)}
									{summary.netAmount.toFixed(2)}
								</div>
								<p className="text-xs text-gray-600">All time</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<BarChart3 className="h-5 w-5" />
								<span>Monthly Breakdown</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{summary.monthlyBreakdown.length > 0 ? (
								<div className="space-y-4">
									{summary.monthlyBreakdown.map((month, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
										>
											<div className="flex-1">
												<h3 className="font-medium text-gray-900">
													{month.month}
												</h3>
												<div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
													<div className="flex items-center space-x-1">
														<TrendingUp className="h-4 w-4 text-green-600" />
														<span>
															{getCurrencySymbol(summary.currency)}
															{month.earnings.toFixed(2)}
														</span>
													</div>
													<div className="flex items-center space-x-1">
														<TrendingDown className="h-4 w-4 text-red-600" />
														<span>
															{getCurrencySymbol(summary.currency)}
															{month.expenses.toFixed(2)}
														</span>
													</div>
													<div className="flex items-center space-x-1">
														<DollarSign className="h-4 w-4 text-blue-600" />
														<span
															className={
																month.netAmount >= 0
																	? "text-blue-600"
																	: "text-red-600"
															}
														>
															{getCurrencySymbol(summary.currency)}
															{month.netAmount.toFixed(2)}
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
									<p className="text-gray-500">No monthly data available</p>
									<p className="text-sm text-gray-400">
										Start adding expenses and earnings to see monthly breakdown
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</>
			) : (
				<div className="text-center py-8">
					<BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
					<p className="text-gray-500">No summary data available</p>
					<p className="text-sm text-gray-400">
						Start adding expenses and earnings to see your financial summary
					</p>
				</div>
			)}
		</div>
	);
}
