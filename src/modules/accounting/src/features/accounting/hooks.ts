import { useState, useEffect, useCallback } from 'react';
import { Transaction, AccountingFilters } from './types';
import { calculateFinancialSummary, filterTransactions } from './utils';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const saved = localStorage.getItem('contractor_transactions');
        if (saved) {
          setTransactions(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('contractor_transactions', JSON.stringify(updatedTransactions));
    
    return newTransaction;
  }, [transactions]);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === id ? { ...transaction, ...updates } : transaction
    );
    
    setTransactions(updatedTransactions);
    localStorage.setItem('contractor_transactions', JSON.stringify(updatedTransactions));
  }, [transactions]);

  const deleteTransaction = useCallback((id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('contractor_transactions', JSON.stringify(updatedTransactions));
  }, [transactions]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export const useFinancialSummary = (transactions: Transaction[]) => {
  const [summary, setSummary] = useState(() => calculateFinancialSummary(transactions));

  useEffect(() => {
    setSummary(calculateFinancialSummary(transactions));
  }, [transactions]);

  return summary;
};

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<AccountingFilters>({});
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, filters));
  }, [transactions, filters]);

  const updateFilters = useCallback((newFilters: Partial<AccountingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    filteredTransactions,
    updateFilters,
    clearFilters,
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = () => {
      try {
        const saved = localStorage.getItem('contractor_categories');
        if (saved) {
          setCategories(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const addCategory = useCallback((category: string) => {
    if (!categories.includes(category)) {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      localStorage.setItem('contractor_categories', JSON.stringify(updatedCategories));
    }
  }, [categories]);

  const removeCategory = useCallback((category: string) => {
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    localStorage.setItem('contractor_categories', JSON.stringify(updatedCategories));
  }, [categories]);

  return {
    categories,
    addCategory,
    removeCategory,
  };
};
