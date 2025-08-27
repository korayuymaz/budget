"use client";

import { AuthProvider } from "./AuthProvider";
import ApolloProviderWrapper from "./ApolloProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<ApolloProviderWrapper>{children}</ApolloProviderWrapper>
		</AuthProvider>
	);
}
