// GraphQL client configuration
// This will be used when you implement GraphQL in your backend

export const GRAPHQL_ENDPOINT =
	process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/graphql";

export interface GraphQLResponse<T = unknown> {
	data?: T;
	errors?: Array<{
		message: string;
		locations?: Array<{ line: number; column: number }>;
		path?: string[];
	}>;
}

class GraphQLClient {
	private async request<T = unknown>(
		query: string,
		variables?: Record<string, unknown>
	): Promise<GraphQLResponse<T>> {
		const response = await fetch(GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		if (!response.ok) {
			throw new Error(`GraphQL request failed: ${response.statusText}`);
		}

		return response.json();
	}

	async query<T = unknown>(
		query: string,
		variables?: Record<string, unknown>
	): Promise<T> {
		const response = await this.request<T>(query, variables);

		if (response.errors) {
			throw new Error(
				`GraphQL errors: ${response.errors.map((e) => e.message).join(", ")}`
			);
		}

		return response.data as T;
	}

	async mutation<T = unknown>(
		mutation: string,
		variables?: Record<string, unknown>
	): Promise<T> {
		return this.query<T>(mutation, variables);
	}
}

export const graphqlClient = new GraphQLClient();

// Example GraphQL queries and mutations (to be used when backend is ready)
export const EXPENSES_QUERY = `
  query GetExpenses {
    expenses {
      id
      description
      amount
      currency
      date
      expenseType
      isFixed
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_EXPENSE_MUTATION = `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      description
      amount
      currency
      date
      expenseType
      isFixed
      createdAt
      updatedAt
    }
  }
`;

export const EARNINGS_QUERY = `
  query GetEarnings {
    earnings {
      id
      description
      amount
      currency
      date
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_EARNING_MUTATION = `
  mutation CreateEarning($input: CreateEarningInput!) {
    createEarning(input: $input) {
      id
      description
      amount
      currency
      date
      createdAt
      updatedAt
    }
  }
`;

export const SUMMARY_QUERY = `
  query GetSummary {
    summary {
      totalEarnings
      totalExpenses
      netAmount
      currency
      monthlyBreakdown {
        month
        earnings
        expenses
        netAmount
      }
    }
  }
`;
