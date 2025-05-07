import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { ITransaction } from '../../shared/interfaces/transactions.interfaces';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '../../shared/enums/others.enum';
import { PaymentService } from '../../core/services/payment.service';
import { UserService } from '../../core/services/user.service';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('proceedPayment') proceedPaymentRef!: TemplateRef<any>;

  isReady: boolean = false;

  tableCols: TableColumn[] = [
    {
      key: 'transactionId',
      label: 'LABEL.ID',
      style: () => ({
        maxWidth: '30px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }),
    },
    {
      key: 'type',
      label: 'LABEL.TYPE',
      translateLabel: (data: ITransaction) => this.onGetType(data.type),
    },
    {
      key: 'updatedAt',
      label: 'LABEL.TIME',
      render: (val) => new Date(val.createdAt).toLocaleString(),
    },
    {
      key: 'amount',
      label: 'LABEL.AMOUNT',
      isMoney: true,
      render: (data: ITransaction) => `${Math.abs(data.totalAmount)}`,
    },
    {
      key: 'status',
      label: 'LABEL.STATUS',
      translateLabel: (val: any) => this.onGetStatus(val.status),
      style: (val: any) => ({ color: this.onGetStatus(val.status, true) }),
    },
  ];

  transactions: ITransaction[] = [];

  ngOnInit(): void {
    this.initTransactions();
  }

  ngAfterViewInit(): void {
    this.tableCols.push({
      key: 'action',
      label: '',
      elementRef: this.proceedPaymentRef,
    });
  }

  constructor(
    private payment: PaymentService,
    private user: UserService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  initTransactions() {
    if (!this.user.user$.value) return;

    this.isReady = false;
    this.payment
      .filterTransaction({ UserId: this.user.user$.value.id })
      .subscribe((res) => {
        if (!res?.payload) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.FAILED_TO_GET_TRANSACTION')
          );
          return;
        }

        this.transactions = res.payload.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isReady = true;
      });
  }

  onGetType(type: TransactionTypeEnum) {
    switch (type.toLowerCase()) {
      case TransactionTypeEnum.CART:
        return 'LABEL.COURSE_PURCHASED';
      case TransactionTypeEnum.REFUND:
        return 'LABEL.REFUND';
      case TransactionTypeEnum.SUBSCRIPTION:
        return 'LABEL.SUBSCRIPTION';
      case TransactionTypeEnum.TRANSFER:
        return 'LABEL.TRANSFER';
      default:
        return 'LABEL.OTHERS';
    }
  }

  onProceedPayment(row: ITransaction) {
    if (!row?.url) return;

    window.open(row.url, '_blank');
  }

  onCancel(row: ITransaction) {
    this.payment.cancelPayment().subscribe((res) => {
      if(res?.isError) return;

      this.message.addMessage('success', this.translate.instant('MESSAGE.CANCEL_SUCCESS'));
      this.initTransactions();
    });
  }

  onGetStatus(status: TransactionStatusEnum, isGetColor?: boolean): string {
    switch (status.toLowerCase()) {
      case TransactionStatusEnum.CANCELLED:
        return isGetColor ? 'var(--error)' : 'LABEL.CANCELLED';
      case TransactionStatusEnum.PENDING:
        return isGetColor ? 'var(--warning)' : 'LABEL.PENDING';
      case TransactionStatusEnum.EXPIRED:
        return isGetColor ? 'var(--tertiary-text)' : 'LABEL.EXPIRED';
      case TransactionStatusEnum.FAILED:
        return isGetColor ? 'var(--alert)' : 'LABEL.FAILED';
      case TransactionStatusEnum.COMPLETED:
        return isGetColor ? 'var(--success)' : 'LABEL.SUCCESS';
      default:
        return 'LABEL.UNKNOWN';
    }
  }
}
