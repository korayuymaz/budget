"use client";

import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { Wallet, LogIn } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { CREATE_USER } from "@/graphql/mutations";

export default function SignInPage() {
	const { data: session, status } = useSession();
	const { data: user, loading: userLoading } = useQuery(GET_USER_BY_ID, {
		variables: { id: session?.user.id },
	});

	// Utility function to handle user creation/update
	const [createUser] = useMutation(CREATE_USER, {
		onCompleted: () => {
			redirect("/");
		},
	});

	const handleUserInDatabase = () => {
		createUser({
			variables: {
				user: {
					googleId: session?.user?.googleId,
					email: session?.user?.email,
					name: session?.user?.name,
					preferredCurrency: "TRY",
				},
			},
		});
	};

	if (userLoading) {
		return <div>Loading...</div>;
	}

	if (user) {
		redirect("/");
	}

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (session) {
		if (!user) {
			handleUserInDatabase();
			redirect("/");
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
						<Wallet className="h-8 w-8 text-blue-600" />
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Welcome to Budget Tracker
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Sign in to start tracking your expenses and earnings
					</p>
				</div>
				<div className="mt-8 space-y-6">
					<div>
						<button
							onClick={() => signIn("google", { callbackUrl: "/" })}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							<LogIn className="h-5 w-5 mr-2" />
							Sign in with Google
						</button>
					</div>
					<div className="text-center">
						<p className="text-xs text-gray-500">
							By signing in, you agree to our terms of service and privacy
							policy
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
