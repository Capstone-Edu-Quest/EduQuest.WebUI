import { TransactionsStatusEnum } from "../enums/transactions.enum";

export interface ITransaction {
    id: string;
    description: string;
    time: string;
    amount: number;
    status: TransactionsStatusEnum;
}