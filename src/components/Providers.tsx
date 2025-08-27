"use client";

import { AuthProvider } from "./AuthProvider";
import ApolloProviderWrapper from "./ApolloProvider";
import SessionProvider from "./SessionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<ApolloProviderWrapper>
				<SessionProvider>{children}</SessionProvider>
			</ApolloProviderWrapper>
		</AuthProvider>
	);
}
