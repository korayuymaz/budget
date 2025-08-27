import { gql } from "@apollo/client";

export const CREATE_EXPENSE = gql`
	mutation CreateExpense($data: CreateExpenseInput!) {
		createExpense(data: $data) {
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

export const UPDATE_EXPENSE = gql`
	mutation UpdateExpense($id: ID!, $data: ExpensesInput!) {
		updateExpense(id: $id, data: $data) {
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

export const DELETE_EXPENSE = gql`
	mutation DeleteExpense($id: ID!) {
		deleteExpense(id: $id)
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
		deleteEarning(id: $id)
	}
`;

export const CREATE_USER = gql`
	mutation CreateUser($data: UsersInput!) {
		createUsers(data: $data) {
			googleId
			email
			name
			preferredCurrency
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($data: UsersInput!) {
		updateUsers(data: $data) {
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
