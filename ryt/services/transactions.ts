import { Transaction, TransactionType } from '../types/transaction';

// Categories for transactions
const categories = [
  'Groceries',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Dining',
  'Healthcare',
  'Transfer'
];

// Merchants for each category
const merchants: Record<string, string[]> = {
  Groceries: ['Walmart', 'Whole Foods', 'Trader Joe\'s', 'Costco'],
  Shopping: ['Amazon', 'Target', 'Best Buy', 'Apple Store'],
  Transportation: ['Uber', 'Lyft', 'Shell', 'BP'],
  Entertainment: ['Netflix', 'Spotify', 'AMC Theaters', 'Steam'],
  Utilities: ['Electric Company', 'Water Corp', 'Internet Provider', 'Gas Company'],
  Dining: ['Starbucks', 'McDonald\'s', 'Chipotle', 'Local Restaurant'],
  Healthcare: ['CVS Pharmacy', 'Medical Center', 'Dental Care', 'Vision Center'],
  Transfer: ['Bank Transfer', 'Venmo', 'PayPal', 'Zelle']
};

function generateMockTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const type: TransactionType = Math.random() > 0.7 ? 'credit' : 'debit';
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[category][Math.floor(Math.random() * merchants[category].length)];
    const amount = parseFloat((Math.random() * 500 + 1).toFixed(2));
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    transactions.push({
      id: `txn-${Date.now()}-${i}`,
      amount: amount,
      date: date.toISOString(),
      description: `Payment to ${merchant}`,
      type: type,
      merchant: merchant,
      category: category,
      status: Math.random() > 0.9 ? 'pending' : 'completed',
      reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      isMasked: true
    });
  }

  // Sort by date, most recent first
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export class TransactionService {
  private static instance: TransactionService;
  private transactions: Transaction[] = [];

  private constructor() {
    this.transactions = generateMockTransactions(20);
  }

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id);
  }
  toggleMask(id: string): Transaction | undefined {
    const transaction = this.transactions.find(t => t.id === id);
    if (transaction) {
      transaction.isMasked = !transaction.isMasked;
      // Return the updated transaction so UI can update immediately
      return { ...transaction };
    }
    return undefined;
  }

  // Get transactions filtered by type, category, or date range
  filterTransactions(filters: {
    type?: TransactionType;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }): Transaction[] {
    return this.transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        (!filters.type || transaction.type === filters.type) &&
        (!filters.category || transaction.category === filters.category) &&
        (!filters.startDate || date >= filters.startDate) &&
        (!filters.endDate || date <= filters.endDate)
      );
    });
  }
}
