export type TransactionType = 'TOP_UP' | 'REFUND' | 'PAYMENT';

export interface TransactionLog {
  id: string;
  timestamp: string; // ISO 8601
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  orderId?: string; // Optional for PAYMENT
}
