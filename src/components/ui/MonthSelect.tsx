import months from "@/data/months";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const MonthSelect = ({
	month,
	setMonth,
}: {
	month: string;
	setMonth: (month: string) => void;
}) => {
	return (
		<Select value={month} onValueChange={setMonth}>
			<SelectTrigger>
				<SelectValue placeholder={month} />
			</SelectTrigger>
			<SelectContent>
				{months.map((month) => (
					<SelectItem key={month.value} value={month.value}>
						{month.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default MonthSelect;
