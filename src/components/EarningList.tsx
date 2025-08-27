"use client";

import { useState, useEffect } from "react";
import { Earning } from "@/types";
import { format } from "date-fns";
import { Calendar, DollarSign, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EARNINGS } from "@/graphql/queries";
import { DELETE_EARNING } from "@/graphql/mutations";
import { useSession } from "next-auth/react";

export function EarningList() {
	const [earnings, setEarnings] = useState<Earning[]>([]);
	const { data, loading, error } = useQuery(GET_EARNINGS);
	const [deleteEarning] = useMutation(DELETE_EARNING);
	const { data: session } = useSession();
	useEffect(() => {
		if (data) {
			setEarnings(data.earnings);
		}
	}, [data]);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this earning?")) {
			return;
		}

		try {
			await deleteEarning({
				variables: {
					id,
				},
				context: {
					headers: {
						"x-user-email": session?.user?.email,
					},
				},
			});
			setEarnings(earnings.filter((earning) => earning.id !== id));
		} catch (err) {
			console.error("Error deleting earning:", err);
			alert("Failed to delete earning");
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

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">{error.message}</p>
				<button
					onClick={() => {}}
					className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
				>
					Retry
				</button>
			</div>
		);
	}

	if (earnings.length === 0) {
		return (
			<div className="text-center py-8">
				<DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
				<p className="text-gray-500">No earnings recorded yet</p>
				<p className="text-sm text-gray-400">
					Start adding earnings to see them here
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{earnings.map((earning) => (
				<div
					key={earning.id}
					className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
				>
					<div className="flex-1">
						<h3 className="font-medium text-gray-900">{earning.description}</h3>
						<div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
							<div className="flex items-center space-x-1">
								<DollarSign className="h-4 w-4" />
								<span>
									{getCurrencySymbol(earning.currency)}
									{earning.amount.toFixed(2)}
								</span>
							</div>
							<div className="flex items-center space-x-1">
								<Calendar className="h-4 w-4" />
								<span>{format(new Date(earning.date), "MMM dd, yyyy")}</span>
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => handleDelete(earning.id)}
							className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
							title="Delete earning"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
