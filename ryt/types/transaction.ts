export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  merchant: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  isMasked: boolean;
}
