import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
				token.googleId = user.id; // Google ID is the same as user.id for Google provider
			}
			if (account?.provider === "google") {
				token.googleId = account.providerAccountId;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.googleId = token.googleId as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
	},
	session: {
		strategy: "jwt",
	},
};
