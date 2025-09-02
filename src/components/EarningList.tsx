"use client";

import { useState, useEffect, useContext } from "react";
import { Earning } from "@/types";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EARNINGS_MONTHLY } from "@/graphql/queries";
import { DELETE_EARNING } from "@/graphql/mutations";
import { UserContext } from "./SessionProvider";
import { Row } from "@tanstack/react-table";
import { DataTable } from "./ui/DataTable";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";

type DisplayEarning = Omit<Earning, "date"> & { date: string };

export function EarningList({ month }: { month: string }) {
	const [earnings, setEarnings] = useState<Earning[]>([]);
	const [displayEarnings, setDisplayEarnings] = useState<DisplayEarning[]>([]);
	const { user } = useContext(UserContext);

	// Only execute the query if user exists and has an ID
	const { data, loading, error } = useQuery(GET_EARNINGS_MONTHLY, {
		variables: {
			userId: user?.id,
			month: month,
		},
		skip: !user?.id, // Skip the query if user doesn't exist or doesn't have an ID
		fetchPolicy: "cache-and-network", // This ensures fresh data is fetched
	});

	const [deleteEarning] = useMutation(DELETE_EARNING);

	const transformData = (data: Earning[]): DisplayEarning[] => {
		return data.map((earning) => ({
			...earning,
			date: format(new Date(earning.date), "dd MMM yyyy"),
		}));
	};

	useEffect(() => {
		if (data?.earningsMonthly) {
			setEarnings(data.earningsMonthly);
			setDisplayEarnings(transformData(data.earningsMonthly));
		}
	}, [data, month]);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this earning?")) {
			return;
		}

		try {
			const result = await deleteEarning({
				variables: { id },
			});

			if (result.data?.deleteEarnings) {
				setEarnings(earnings.filter((earning) => earning.id !== id));
				setDisplayEarnings(
					displayEarnings.filter((earning) => earning.id !== id)
				);
			} else {
				alert("Failed to delete earning");
			}
		} catch (err) {
			console.error("Error deleting earning:", err);
			alert("Failed to delete earning");
		}
	};

	// Show loading state while user is being fetched or earnings are loading
	if (!user) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
			</div>
		);
	}

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
					onClick={() => window.location.reload()}
					className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
				>
					Retry
				</button>
			</div>
		);
	}

	if (displayEarnings.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">No earnings recorded yet</p>
				<p className="text-sm text-gray-400">
					Start adding earnings to see them here
				</p>
			</div>
		);
	}

	const columns = [
		{
			header: "Description",
			accessorKey: "description",
		},

		{
			header: "Amount",
			accessorKey: "amount",
			cell: ({ row }: { row: Row<DisplayEarning> }) => {
				return (
					<span>
						{getCurrencySymbol(row.original.currency)} {row.original.amount}
					</span>
				);
			},
		},
		{
			header: "Date",
			accessorKey: "date",
		},
		{
			header: "Actions",
			accessorKey: "actions",
			cell: ({ row }: { row: Row<DisplayEarning> }) => {
				return (
					<button onClick={() => handleDelete(row.original.id)}>
						<Trash2 className="h-4 w-4 text-red-500" />
					</button>
				);
			},
		},
	];

	return <DataTable columns={columns} data={displayEarnings} />;
}
