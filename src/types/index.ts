export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  preferredCurrency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  currency: Currency;
  date: Date;
  expenseType: ExpenseType;
  isFixed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Earning {
  id: string;
  userId: string;
  description: string;
  amount: number;
  currency: Currency;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Summary {
  totalEarnings: number;
  totalExpenses: number;
  netAmount: number;
  currency: Currency;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface MonthlyBreakdown {
  month: string;
  earnings: number;
  expenses: number;
  netAmount: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'TRY' | 'JPY' | 'CAD' | 'AUD';

export type ExpenseType = 
  | 'FOOD'
  | 'TRANSPORTATION'
  | 'HOUSING'
  | 'UTILITIES'
  | 'ENTERTAINMENT'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'SHOPPING'
  | 'INSURANCE'
  | 'OTHER';

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  currency: Currency;
  date: string;
  expenseType: ExpenseType;
  isFixed: boolean;
}

export interface CreateEarningRequest {
  description: string;
  amount: number;
  currency: Currency;
  date: string;
}

export interface UpdateUserRequest {
  preferredCurrency: Currency;
} 