import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '../enums/others.enum';

export interface ITransaction {
  transactionId: string;
  userId: string;
  totalAmount: number;
  netAmount: number | null;
  stripeFee: number | null;
  status: TransactionStatusEnum;
  type: TransactionTypeEnum;
  paymentIntentId: string | null;
  customerEmail: string | null;
  customerName: string | null;
  url: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  details: any[];
}

export interface ITransactionFilterParams {
  TransactionId?: string;
  UserId?: string;
  CourseId?: string;
  Status?: TransactionStatusEnum;
  Type?: TransactionTypeEnum;
}
