import { Transaction, FinancialSummary, AccountingFilters } from './types';

export const calculateFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  const summary: FinancialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeByCategory: {},
    expensesByCategory: {},
    incomeByLocation: {},
    expensesByLocation: {},
  };

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
      
      // Group by category
      summary.incomeByCategory[transaction.category] = 
        (summary.incomeByCategory[transaction.category] || 0) + transaction.amount;
      
      // Group by location
      if (transaction.location) {
        summary.incomeByLocation[transaction.location] = 
          (summary.incomeByLocation[transaction.location] || 0) + transaction.amount;
      }
    } else {
      summary.totalExpenses += transaction.amount;
      
      // Group by category
      summary.expensesByCategory[transaction.category] = 
        (summary.expensesByCategory[transaction.category] || 0) + transaction.amount;
      
      // Group by location
      if (transaction.location) {
        summary.expensesByLocation[transaction.location] = 
          (summary.expensesByLocation[transaction.location] || 0) + transaction.amount;
      }
    }
  });

  summary.balance = summary.totalIncome - summary.totalExpenses;
  return summary;
};

export const filterTransactions = (
  transactions: Transaction[], 
  filters: AccountingFilters
): Transaction[] => {
  return transactions.filter(transaction => {
    // Date filtering
    if (filters.startDate && transaction.date < filters.startDate) return false;
    if (filters.endDate && transaction.date > filters.endDate) return false;
    
    // Category filtering
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(transaction.category)) return false;
    }
    
    // Location filtering
    if (filters.locations && filters.locations.length > 0) {
      if (!transaction.location || !filters.locations.includes(transaction.location)) return false;
    }
    
    // Type filtering
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(transaction.type)) return false;
    }
    
    // Amount filtering
    if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) return false;
    
    return true;
  });
};

export const formatCurrency = (amount: number, currency: string = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const getMonthName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' });
};

export const groupTransactionsByMonth = (transactions: Transaction[]): Record<string, Transaction[]> => {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const monthKey = transaction.date.substring(0, 7); // YYYY-MM format
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(transaction);
  });
  
  return grouped;
};

export const sortTransactionsByDate = (transactions: Transaction[], ascending: boolean = false): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
