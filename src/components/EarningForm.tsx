"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Currency } from "@/types";
import { Calendar, DollarSign, FileText } from "lucide-react";
import { CREATE_EARNING } from "@/graphql/mutations";
import { GET_EARNINGS_MONTHLY } from "@/graphql/queries";
import { ApolloError, useMutation } from "@apollo/client";
import { UserContext } from "./SessionProvider";

const earningSchema = z.object({
	description: z.string().min(1, "Description is required"),
	amount: z.number().positive("Amount must be positive"),
	currency: z.enum(["USD", "EUR", "GBP", "TRY", "JPY", "CAD", "AUD"] as const),
	date: z.string().min(1, "Date is required"),
});

type EarningFormData = z.infer<typeof earningSchema>;

export function EarningForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { user } = useContext(UserContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EarningFormData>({
		resolver: zodResolver(earningSchema),
		defaultValues: {
			currency: user?.preferredCurrency || "USD",
			date: new Date().toISOString().split("T")[0],
		},
	});

	const [createEarning] = useMutation(CREATE_EARNING, {
		onCompleted: () => {
			setIsSubmitting(false);
		},
		onError: (err: ApolloError) => {
			console.error("Failed to create earning:", err.graphQLErrors);
		},
		refetchQueries: [GET_EARNINGS_MONTHLY],
	});

	const onSubmit = (data: EarningFormData) => {
		createEarning({
			variables: { earnings: { ...data, userId: user?.id } },
		});
	};

	const currencies: { value: Currency; label: string; symbol: string }[] = [
		{ value: "USD", label: "US Dollar", symbol: "$" },
		{ value: "EUR", label: "Euro", symbol: "€" },
		{ value: "GBP", label: "British Pound", symbol: "£" },
		{ value: "TRY", label: "Turkish Lira", symbol: "₺" },
		{ value: "JPY", label: "Japanese Yen", symbol: "¥" },
		{ value: "CAD", label: "Canadian Dollar", symbol: "C$" },
		{ value: "AUD", label: "Australian Dollar", symbol: "A$" },
	];

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Description */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<FileText className="h-4 w-4 inline mr-2" />
						Description
					</label>
					<input
						type="text"
						{...register("description")}
						className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
						placeholder="Enter earning description"
					/>
					{errors.description && (
						<p className="text-red-600 text-sm mt-1">
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Amount */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<DollarSign className="h-4 w-4 inline mr-2" />
						Amount
					</label>
					<input
						type="number"
						step="0.01"
						{...register("amount", { valueAsNumber: true })}
						className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
						placeholder="0.00"
					/>
					{errors.amount && (
						<p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
					)}
				</div>

				{/* Currency */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Currency
					</label>
					<select
						{...register("currency")}
						className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
					>
						{currencies.map((currency) => (
							<option key={currency.value} value={currency.value}>
								{currency.symbol} {currency.label}
							</option>
						))}
					</select>
				</div>

				{/* Date */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<Calendar className="h-4 w-4 inline mr-2" />
						Date
					</label>
					<input
						type="date"
						{...register("date")}
						className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
					/>
					{errors.date && (
						<p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
					)}
				</div>
			</div>

			<div className="flex justify-end space-x-4">
				<button
					type="button"
					onClick={() => reset()}
					className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
				>
					Reset
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "Adding..." : "Add Earning"}
				</button>
			</div>
		</form>
	);
}
