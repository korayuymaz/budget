import { gql } from "@apollo/client";

export const CREATE_EXPENSE = gql`
	mutation CreateExpense($expenses: ExpensesInput!) {
		createExpenses(expenses: $expenses) {
			id
			description
			amount
			userId
			currency
			date
			category
			isFixed
		}
	}
`;

export const UPDATE_EXPENSE = gql`
	mutation UpdateExpense($id: ID!, $data: ExpensesInput!) {
		updateExpense(id: $id, data: $data) {
			id
			description
			amount
			userId
			currency
			date
			category
			isFixed
		}
	}
`;

export const DELETE_EXPENSE = gql`
	mutation DeleteExpense($id: ID!) {
		deleteExpenses(id: $id)
	}
`;

export const CREATE_EARNING = gql`
	mutation CreateEarning($earnings: EarningsInput!) {
		createEarnings(earnings: $earnings) {
			id
			description
			amount
			currency
			date
		}
	}
`;

export const UPDATE_EARNING = gql`
	mutation UpdateEarning($id: ID!, $data: EarningsInput!) {
		updateEarnings(id: $id, data: $data) {
			id
			description
			amount
			currency
			date
		}
	}
`;

export const DELETE_EARNING = gql`
	mutation DeleteEarning($id: ID!) {
		deleteEarnings(id: $id)
	}
`;

export const CREATE_USER = gql`
	mutation CreateUser($user: UserInput!) {
		createUser(user: $user) {
			googleId
			email
			name
			preferredCurrency
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($user: UpdateUserInput!) {
		updateUser(user: $user) {
			id
			googleId
			email
			name
			preferredCurrency
		}
	}
`;

export const DELETE_USER = gql`
	mutation DeleteUser {
		deleteUser {
			googleId
		}
	}
`;
