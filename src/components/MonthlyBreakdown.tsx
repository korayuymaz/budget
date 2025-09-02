import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Summary } from "@/types";

const MonthlyBreakdown = ({ summary }: { summary: Summary }) => {
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

	return (
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
									<h3 className="font-medium text-gray-900">{month.month}</h3>
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
											<span
												className={
													month.net >= 0 ? "text-blue-600" : "text-red-600"
												}
											>
												{getCurrencySymbol(summary.currency)}
												{month.net.toFixed(2)}
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
	);
};

export default MonthlyBreakdown;
