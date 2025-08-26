export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  location?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  incomeByLocation: Record<string, number>;
  expensesByLocation: Record<string, number>;
}

export interface AccountingFilters {
  startDate?: string;
  endDate?: string;
  categories?: string[];
  locations?: string[];
  types?: ('income' | 'expense')[];
  minAmount?: number;
  maxAmount?: number;
}

export type ToolItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  owner: 'self' | 'borrowed';
  date: string;
  notes?: string;
};
