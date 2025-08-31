import { X, Plus } from "lucide-react";

const OpenCloseForm = ({
	OpenText,
	CloseText,
	showForm,
	setShowForm,
}: {
	OpenText: string;
	CloseText: string;
	showForm: boolean;
	setShowForm: (showForm: boolean) => void;
}) => {
	return (
		<>
			{showForm && (
				<button
					onClick={() => setShowForm(false)}
					className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
				>
					<X className="h-4 w-4" />
					{CloseText}
				</button>
			)}
			{!showForm && (
				<button
					onClick={() => setShowForm(true)}
					className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					<Plus className="h-4 w-4" />
					<span>{OpenText}</span>
				</button>
			)}
		</>
	);
};

export default OpenCloseForm;
