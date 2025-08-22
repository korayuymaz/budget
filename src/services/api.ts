import { 
  CreateExpenseRequest, 
  CreateEarningRequest, 
  UpdateUserRequest,
  Expense,
  Earning,
  Summary,
  User
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Expense endpoints
  async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getExpenses(): Promise<Expense[]> {
    return this.request<Expense[]>('/expenses');
  }

  async updateExpense(id: string, data: Partial<CreateExpenseRequest>): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string): Promise<void> {
    return this.request<void>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Earning endpoints
  async createEarning(data: CreateEarningRequest): Promise<Earning> {
    return this.request<Earning>('/earnings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEarnings(): Promise<Earning[]> {
    return this.request<Earning[]>('/earnings');
  }

  async updateEarning(id: string, data: Partial<CreateEarningRequest>): Promise<Earning> {
    return this.request<Earning>(`/earnings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEarning(id: string): Promise<void> {
    return this.request<void>(`/earnings/${id}`, {
      method: 'DELETE',
    });
  }

  // Summary endpoints
  async getSummary(): Promise<Summary> {
    return this.request<Summary>('/summary');
  }

  // User endpoints
  async getUser(): Promise<User> {
    return this.request<User>('/user');
  }

  async updateUser(data: UpdateUserRequest): Promise<User> {
    return this.request<User>('/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(); 