"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EarningForm } from "@/components/EarningForm";
import { EarningList } from "@/components/EarningList";
import { TrendingUp } from "lucide-react";
import OpenCloseForm from "@/components/ui/OpenCloseForm";
import Loading from "@/components/ui/Loading";
import MonthSelect from "@/components/ui/MonthSelect";
import months from "@/data/months";

export default function EarningsPage() {
	const { data: session, status } = useSession();
	const [showForm, setShowForm] = useState(false);
	const [month, setMonth] = useState(months[new Date().getMonth()].value);

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
					<h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
					<p className="text-gray-600 mt-2">Track your income and earnings</p>
				</div>
				<OpenCloseForm
					OpenText="Add Earning"
					CloseText="Close"
					showForm={showForm}
					setShowForm={setShowForm}
				/>
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
						<EarningForm />
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader className="flex items-center justify-between">
					<CardTitle>Your Earnings</CardTitle>
					<div className="flex items-center space-x-2">
						<span>Month:</span>
						<MonthSelect month={month} setMonth={setMonth} />
					</div>
				</CardHeader>
				<CardContent>
					<EarningList month={month} />
				</CardContent>
			</Card>
		</div>
	);
}
