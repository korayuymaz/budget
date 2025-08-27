"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/types";
import { format } from "date-fns";
import { Calendar, DollarSign, Tag, Trash2 } from "lucide-react";
import { GET_EXPENSES } from "@/graphql/queries";
import { DELETE_EXPENSE } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import { client } from "@/app/lib/apollo";

export function ExpenseList() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	useEffect(() => {
		loadExpenses();
	}, []);

	const loadExpenses = async () => {
		try {
			setLoading(true);
			const { data } = await client.query({ query: GET_EXPENSES });
			setExpenses(data.expenses);
		} catch (err) {
			setError("Failed to load expenses");
			console.error("Error loading expenses:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this expense?")) {
			return;
		}

		try {
			await client.mutate({
				mutation: DELETE_EXPENSE,
				variables: { id },
			});
			setExpenses(expenses.filter((expense) => expense.id !== id));
			router.push("/expenses");
		} catch (err) {
			console.error("Error deleting expense:", err);
			alert("Failed to delete expense");
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

	const getExpenseTypeLabel = (type: string) => {
		const types: Record<string, string> = {
			FOOD: "Food & Dining",
			TRANSPORTATION: "Transportation",
			HOUSING: "Housing",
			UTILITIES: "Utilities",
			ENTERTAINMENT: "Entertainment",
			HEALTHCARE: "Healthcare",
			EDUCATION: "Education",
			SHOPPING: "Shopping",
			INSURANCE: "Insurance",
			OTHER: "Other",
		};
		return types[type] || type;
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">{error}</p>
				<button
					onClick={loadExpenses}
					className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		);
	}

	if (expenses.length === 0) {
		return (
			<div className="text-center py-8">
				<DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
				<p className="text-gray-500">No expenses recorded yet</p>
				<p className="text-sm text-gray-400">
					Start adding expenses to see them here
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{expenses.map((expense) => (
				<div
					key={expense.id}
					className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
				>
					<div className="flex-1">
						<div className="flex items-center space-x-3">
							<h3 className="font-medium text-gray-900">
								{expense.description}
							</h3>
							{expense.isFixed && (
								<span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
									Fixed
								</span>
							)}
						</div>
						<div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
							<div className="flex items-center space-x-1">
								<DollarSign className="h-4 w-4" />
								<span>
									{getCurrencySymbol(expense.currency)}
									{expense.amount.toFixed(2)}
								</span>
							</div>
							<div className="flex items-center space-x-1">
								<Tag className="h-4 w-4" />
								<span>{getExpenseTypeLabel(expense.category)}</span>
							</div>
							<div className="flex items-center space-x-1">
								<Calendar className="h-4 w-4" />
								<span>{format(new Date(expense.date), "MMM dd, yyyy")}</span>
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => handleDelete(expense.id)}
							className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
							title="Delete expense"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
