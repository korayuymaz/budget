import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { createContext, useState } from "react";
import { User } from "@/types";

export const UserContext = createContext<{
	user: User | null;
	setUser: (user: User | null) => void;
}>({ user: null, setUser: () => {} });

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: session } = useSession();
	const [user, setUser] = useState<User | null>(null);

	// Only execute the query if session exists and has an email
	const { data: userData } = useQuery(GET_USER_BY_ID, {
		variables: { email: session?.user?.email },
		skip: !session?.user?.email, // Skip the query if session doesn't exist or doesn't have an email
		fetchPolicy: "cache-and-network",
	});

	return (
		<UserContext.Provider value={{ user: userData?.user || user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default SessionProvider;
