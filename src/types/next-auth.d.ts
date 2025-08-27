import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			googleId: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}

	interface User {
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		googleId: string;
	}
}
