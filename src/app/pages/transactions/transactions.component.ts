import { Component, type OnInit } from '@angular/core';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { ITransaction } from '../../shared/interfaces/transactions.interfaces';
import { TransactionsStatusEnum } from '../../shared/enums/transactions.enum';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  tableCols: TableColumn[] = [
    {
      key: 'id',
      label: 'LABEL.ID',
    },
    {
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    {
      key: 'time',
      label: 'LABEL.TIME',
      render: (val) => new Date(val.time).toLocaleString(),
    },
    {
      key: 'amount',
      label: 'LABEL.AMOUNT',
      isMoney: true,
      render: (data: ITransaction) => `${Math.abs(data.amount)}`,
      style: (data: ITransaction) => ({
        color: data.amount < 0 ? 'var(--alert)' : 'var(--success)',
      }),
    },
    {
      key: 'status',
      label: 'LABEL.STATUS',
      translateLabel: (val: any) => this.onGetStatus(val.status),
      style: (val: any) => ({ color: this.onGetStatus(val.status, true) }),
    },
  ];

  transactions: ITransaction[] = [
    {
      id: 'txn-001',
      description: 'Payment for online course',
      time: '2025-02-23T10:15:30Z',
      amount: -120.5,
      status: TransactionsStatusEnum.SUCCESS,
    },
    {
      id: 'txn-003',
      description: 'Subscription renewal for premium service',
      time: '2025-02-21T09:45:00Z',
      amount: -19.99,
      status: TransactionsStatusEnum.PENDING,
    },
    {
      id: 'txn-004',
      description: 'Withdrawal to bank account',
      time: '2025-02-20T17:10:15Z',
      amount: 200.0,
      status: TransactionsStatusEnum.FAILED,
    },
  ];

  onGetStatus(status: TransactionsStatusEnum, isGetColor?: boolean): string {
    switch (status) {
      case TransactionsStatusEnum.SUCCESS:
        return isGetColor ? 'var(--success)' : 'LABEL.SUCCESS';
      case TransactionsStatusEnum.PENDING:
        return isGetColor ? 'var(--warning)' : 'LABEL.PENDING';
      case TransactionsStatusEnum.FAILED:
        return isGetColor ? 'var(--alert)' : 'LABEL.FAILED';
      default:
        return 'LABEL.UNKNOWN';
    }
  }

  ngOnInit(): void {}
}
