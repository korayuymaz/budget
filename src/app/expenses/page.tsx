"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Wallet, Plus, X } from "lucide-react";
import OpenCloseForm from "@/components/OpenCloseForm";
import Loading from "@/components/Loading";

export default function ExpensesPage() {
	const { data: session, status } = useSession();
	const [showForm, setShowForm] = useState(false);

	if (status === "loading") {
		return <Loading />;
	}

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
					<p className="text-gray-600 mt-2">
						Track your variable and fixed expenses
					</p>
				</div>
				<OpenCloseForm
					OpenText="Add Expense"
					CloseText="Close"
					showForm={showForm}
					setShowForm={setShowForm}
				/>
			</div>

			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Wallet className="h-5 w-5" />
							<span>Add New Expense</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ExpenseForm />
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Your Expenses</CardTitle>
				</CardHeader>
				<CardContent>
					<ExpenseList />
				</CardContent>
			</Card>
		</div>
	);
}
