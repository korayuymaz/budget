import { LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Hamburger = ({
	isOpen,
	setIsOpen,
	navItems,
}: {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	navItems: { href: string; label: string; icon: React.ElementType }[];
}) => {
	return (
		<div className="relative p-2">
			<button
				className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Menu className="h-4 w-4" />
			</button>
			{isOpen && (
				<div
					className="text-black absolute flex flex-col bg-gray-100 px-6 py-4 rounded-md space-y-2 top-10 right-2 min-w-[180px] border border-gray-200 shadow-md z-10"
					onClick={() => setIsOpen(!isOpen)}
				>
					{navItems.map((item) => (
						<Link
							href={item.href}
							key={item.href}
							className="flex items-center space-x-2"
						>
							<item.icon className="h-4 w-4 mr-2" />
							{item.label}
						</Link>
					))}
					<button
						onClick={() => signOut()}
						className="flex items-center space-x-2"
					>
						<LogOut className="h-4 w-4" />
					</button>
				</div>
			)}
		</div>
	);
};

export default Hamburger;
