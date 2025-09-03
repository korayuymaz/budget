"use client";

import { useSession, signIn } from "next-auth/react";
import { Wallet, LogIn } from "lucide-react";
import { useMutation } from "@apollo/client";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { CREATE_USER } from "@/graphql/mutations";
import Loading from "@/components/ui/Loading";
import { client } from "@/app/lib/apollo";
import { redirect } from "next/navigation";

export default function SignInPage() {
	const { data: session, status } = useSession();

	const [createUser, { loading: createUserLoading, error: createUserError }] =
		useMutation(CREATE_USER, {
			onCompleted: () => {
				window.location.reload();
				redirect("/");
			},
		});

	const handleUserInDatabase = async () => {
		try {
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
		} catch (err) {
			console.error(err);
		}
	};

	const checkUserInDatabase = async () => {
		try {
			const { data } = await client.query({
				query: GET_USER_BY_ID,
				variables: { email: session?.user.email },
			});
			if (!data?.user) {
				await handleUserInDatabase();
			}
			return data?.user;
		} catch (err) {
			console.error(err);
		}
	};

	if (session) {
		checkUserInDatabase();
		redirect("/");
	}

	if (createUserLoading) {
		return <div>Loading...</div>;
	}

	if (createUserError) {
		console.error(createUserError);
	}

	if (status === "loading") {
		return <Loading />;
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
