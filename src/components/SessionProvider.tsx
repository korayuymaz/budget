import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { createContext } from "react";
import { User } from "@/types";

export const UserContext = createContext<{ user: User | null }>({ user: null });

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: session } = useSession();

	const { data: userData } = useQuery(GET_USER_BY_ID, {
		variables: { email: session?.user.email },
	});

	return (
		<UserContext.Provider value={{ user: userData?.user }}>
			{children}
		</UserContext.Provider>
	);
};

export default SessionProvider;
