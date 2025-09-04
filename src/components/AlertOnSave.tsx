import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

const AlertOnSave = ({
	modalOpen,
	setModalOpen,
	title,
	text,
	onConfirm,
	confirmText = "Continue",
	cancelText = "Cancel",
	showCancel = false,
}: {
	modalOpen: boolean;
	setModalOpen: (modalOpen: boolean) => void;
	title: string;
	text: string;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
}) => {
	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm();
		}
		setModalOpen(false);
	};

	const handleCancel = () => {
		setModalOpen(false);
	};

	return (
		<AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-gray-600 dark:text-gray-400 leading-relaxed">
						{text}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-3 sm:gap-2">
					{showCancel && (
						<AlertDialogAction
							onClick={handleCancel}
							className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
						>
							{cancelText}
						</AlertDialogAction>
					)}
					<AlertDialogAction
						onClick={handleConfirm}
						className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AlertOnSave;
