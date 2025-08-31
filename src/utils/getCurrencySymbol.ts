export const getCurrencySymbol = (currency: string) => {
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
