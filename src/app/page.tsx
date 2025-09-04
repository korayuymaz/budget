"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Loading from "@/components/ui/Loading";
import MonthlyBreakdown from "@/components/MonthlyBreakdown";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
	GET_SUMMARY,
	GET_EXPENSES,
	GET_EARNINGS,
	GET_USER_BY_ID,
} from "@/graphql/queries";
import { UserContext } from "@/components/SessionProvider";
import { Earning, Expense, Summary } from "@/types";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { Row } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { client } from "./lib/apollo";

export default function Dashboard() {
	const { data: session } = useSession();
	const [summary, setSummary] = useState<Summary | null>(null);
	const { user, setUser } = useContext(UserContext);
	const [totalEarnings, setTotalEarnings] = useState<number>(0);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [netAmount, setNetAmount] = useState<number>(0);
	const [totalBalance, setTotalBalance] = useState<number>(0);
	const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
	const [recentEarnings, setRecentEarnings] = useState<Earning[]>([]);

	const { data: expenses, loading: expensesLoading } = useQuery(GET_EXPENSES, {
		variables: {
			userId: user?.id,
		},
		skip: !user?.id, // Skip the query if user doesn't exist or doesn't have an ID
		fetchPolicy: "cache-and-network", // This ensures fresh data is fetched
	});
	const { data: earnings, loading: earningsLoading } = useQuery(GET_EARNINGS, {
		variables: {
			userId: user?.id,
		},
		skip: !user?.id, // Skip the query if user doesn't exist or doesn't have an ID
		fetchPolicy: "cache-and-network", // This ensures fresh data is fetched
	});
	const { data, loading: summaryLoading } = useQuery(GET_SUMMARY, {
		variables: {
			userId: user?.id,
			currency: user?.preferredCurrency || "USD",
		},
		skip: !user?.id, // Skip the query if user doesn't exist or doesn't have an ID
		fetchPolicy: "cache-and-network", // This ensures fresh data is fetched
	});

	const columnsExpenses = [
		{
			header: "Description",
			accessorKey: "description",
		},
		{
			header: "Amount",
			accessorKey: "amount",
			cell: ({ row }: { row: Row<Expense> }) => {
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
			cell: ({ row }: { row: Row<Expense> }) => {
				return <span>{format(row.original.date, "MM/dd/yyyy")}</span>;
			},
		},
		{
			header: "Category",
			accessorKey: "category",
			cell: ({ row }: { row: Row<Expense> }) => {
				return <Badge variant="secondary">{row.original.category}</Badge>;
			},
		},
		{
			header: "Fixed",
			accessorKey: "isFixed",
			cell: ({ row }: { row: Row<Expense> }) => {
				return (
					<Badge variant={row.original.isFixed ? "secondary" : "outline"}>
						{row.original.isFixed ? "Yes" : "No"}
					</Badge>
				);
			},
		},
	];
	const columnsEarnings = [
		{
			header: "Description",
			accessorKey: "description",
		},

		{
			header: "Amount",
			accessorKey: "amount",
			cell: ({ row }: { row: Row<Earning> }) => {
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
			cell: ({ row }: { row: Row<Earning> }) => {
				return <span>{format(row.original.date, "MM/dd/yyyy")}</span>;
			},
		},
	];

	useEffect(() => {
		const summary = data?.summary;
		const thisMonthExpenses = summary?.monthlyBreakdown[0]?.expenses || 0;
		const thisMonthEarnings = summary?.monthlyBreakdown[0]?.earnings || 0;

		if (summary) {
			const totalNetThisMonth = thisMonthEarnings - thisMonthExpenses;
			setSummary(summary);
			setTotalEarnings(thisMonthEarnings);
			setTotalExpenses(thisMonthExpenses);
			setNetAmount(totalNetThisMonth);
			setTotalBalance(summary?.netAmount);
			setRecentExpenses(expenses?.expenses || []);
			setRecentEarnings(earnings?.earnings || []);
		}
	}, [data, expenses, earnings]);

	if (!session?.user) {
		redirect("/auth/signin");
	}

	if (summaryLoading || earningsLoading || expensesLoading) {
		return <Loading />;
	}

	const getUser = async () => {
		const { data } = await client.query({
			query: GET_USER_BY_ID,
			variables: { email: session?.user?.email },
		});
		const user = data?.user;
		setUser(user);
	};

	if (!user && session?.user) {
		getUser();
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-600 mt-2">
						Welcome back, {user?.name}! Here&apos;s your financial overview.
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
						<div className="text-2xl font-bold text-green-600">
							{getCurrencySymbol(summary?.currency || "USD")}
							{totalEarnings.toFixed(2)}
						</div>
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
						<div className="text-2xl font-bold text-red-600">
							{getCurrencySymbol(summary?.currency || "USD")}
							{totalExpenses.toFixed(2)}
						</div>
						<p className="text-xs text-gray-600">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Net Amount</CardTitle>
						<DollarSign className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{getCurrencySymbol(summary?.currency || "USD")}
							{netAmount.toFixed(2)}
						</div>
						<p className="text-xs text-gray-600">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Balance</CardTitle>
						<Wallet className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{getCurrencySymbol(summary?.currency || "USD")}
							{totalBalance.toFixed(2)}
						</div>
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
						{recentExpenses.length > 0 ? (
							<DataTable columns={columnsExpenses} data={recentExpenses} />
						) : (
							<div className="text-center text-gray-500 py-8">
								<p>No expenses recorded yet</p>
								<p className="text-sm">
									Start tracking your expenses to see them here
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Earnings</CardTitle>
					</CardHeader>
					<CardContent>
						{recentEarnings.length > 0 ? (
							<DataTable columns={columnsEarnings} data={recentEarnings} />
						) : (
							<div className="text-center text-gray-500 py-8">
								<p>No earnings recorded yet</p>
								<p className="text-sm">
									Start tracking your earnings to see them here
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			{summary && <MonthlyBreakdown summary={summary} />}
		</div>
	);
}
