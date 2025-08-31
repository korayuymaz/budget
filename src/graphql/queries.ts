import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
	query GetExpenses($userId: ID!) {
		expenses(userId: $userId) {
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
	query GetEarnings($userId: ID!) {
		earnings(userId: $userId) {
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

export const GET_EARNINGS_MONTHLY = gql`
	query GetEarningsMonthly($userId: ID!, $month: String!) {
		earningsMonthly(userId: $userId, month: $month) {
			id
			description
			amount
			currency
			date
		}
	}
`;

export const GET_EXPENSES_MONTHLY = gql`
	query GetExpensesMonthly($userId: ID!, $month: String!) {
		expensesMonthly(userId: $userId, month: $month) {
			id
			description
			currency
			amount
			category
			isFixed
			date
		}
	}
`;
