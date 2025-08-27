import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_API_URL,
});

const authLink = setContext(async (_, { headers }) => {
	const session = await getSession();
	const email = session?.user?.email || null;

	console.log("Apollo authLink email:", email);

	return {
		headers: {
			...headers,
			"x-user-email": email,
		},
	};
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});
