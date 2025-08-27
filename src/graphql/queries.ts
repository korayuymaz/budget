import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
	query GetExpenses {
		expenses {
			id
			description
			amount
			currency
			date
			category
			isFixed
		}
	}
`;

export const GET_EARNINGS = gql`
	query GetEarnings {
		earnings {
			id
			description
			amount
			currency
			date
		}
	}
`;

export const GET_USER_BY_ID = gql`
	query GetUserById($email: String!) {
		user(email: $email) {
			id
			googleId
			name
			email
			preferredCurrency
		}
	}
`;
