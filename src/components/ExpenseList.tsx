"use client";

import { useState, useEffect, useContext } from "react";
import { Expense } from "@/types";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { GET_EXPENSES_MONTHLY } from "@/graphql/queries";
import { DELETE_EXPENSE } from "@/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { UserContext } from "./SessionProvider";
import { DataTable } from "./ui/DataTable";
import { Row } from "@tanstack/react-table";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";

type DisplayExpense = Omit<Expense, "date"> & { date: string };

export function ExpenseList({ month }: { month: string }) {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [displayExpenses, setDisplayExpenses] = useState<DisplayExpense[]>([]);
	const { user } = useContext(UserContext);

	const { data, loading, error } = useQuery(GET_EXPENSES_MONTHLY, {
		variables: {
			userId: user?.id,
			month: month,
		},
		skip: !user?.id,
	});

	const [deleteExpense] = useMutation(DELETE_EXPENSE);

	const transformData = (data: Expense[]): DisplayExpense[] => {
		return data.map((expense) => ({
			...expense,
			date: format(new Date(expense.date), "dd MMM yyyy"),
		}));
	};

	useEffect(() => {
		if (data?.expensesMonthly) {
			setExpenses(data.expensesMonthly);
			setDisplayExpenses(transformData(data.expensesMonthly));
		}
	}, [data, month]);

	const handleDelete = async (id: string) => {
		try {
			if (!confirm("Are you sure you want to delete this expense?")) {
				return;
			}

			const result = await deleteExpense({ variables: { id } });
			if (result.data?.deleteExpenses) {
				setExpenses(expenses.filter((expense) => expense.id !== id));
			} else {
				alert("Failed to delete expense");
			}
		} catch (err) {
			console.error("Error deleting expense:", err);
			alert("Failed to delete expense");
		}
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

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
				<p className="text-red-600">{error.message}</p>
				<button
					onClick={() => window.location.reload()}
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
				<p className="text-gray-500">No expenses recorded yet</p>
				<p className="text-sm text-gray-400">
					Start adding expenses to see them here
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
			cell: ({ row }: { row: Row<DisplayExpense> }) => {
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
			header: "Category",
			accessorKey: "category",
		},
		{
			header: "Fixed",
			accessorKey: "isFixed",
			cell: ({ row }: { row: Row<DisplayExpense> }) => {
				return <span>{row.original.isFixed ? "Yes" : "No"}</span>;
			},
		},
		{
			header: "Actions",
			accessorKey: "actions",
			cell: ({ row }: { row: Row<DisplayExpense> }) => {
				return (
					<button onClick={() => handleDelete(row.original.id)}>
						<Trash2 className="h-4 w-4 text-red-500" />
					</button>
				);
			},
		},
	];

	return <DataTable columns={columns} data={displayExpenses} />;
}
