import { Component, type OnInit } from '@angular/core';
import {
  IGetRevenueItem,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-admin-revenue',
  templateUrl: './admin-revenue.component.html',
  styleUrl: './admin-revenue.component.scss',
})
export class AdminRevenueComponent implements OnInit {
  tableColumns: TableColumn[] = [
    {
      key: 'type',
      label: 'LABEL.TYPE',
    },
    {
      key: 'time',
      label: 'LABEL.TIME',
      render: (val: IGetRevenueItem) =>
        new Date(val.updatedAt).toLocaleString(),
    },
    {
      key: 'amount',
      label: 'LABEL.AMOUNT',
      isMoney: true,
    },
    {
      key: 'stripeFee',
      label: 'LABEL.PAYMENT_FEE',
      isMoney: true,
      customClass: () => 'red',
    },
    {
      key: 'systemShare',
      label: 'LABEL.SYSTEM_KEEP',
      isMoney: true,
    },
    {
      key: 'instructorName',
      label: 'LABEL.INSTRUCTOR',
    },
    {
      key: 'instructorShare',
      label: 'LABEL.INSTRUCTOR_RECEIVED',
      isMoney: true,
    },
    {
      key: 'receive',
      label: 'LABEL.RECEIVED',
      render: (val: any) => (val?.isReceive ? '✔' : ''),
    },
  ];

  isDataReady: boolean = false;

  tableData: IGetRevenueItem[] = [];

  arrowRight = faArrowRight;

  from: string | null = null;
  to: string | null = null;

  constructor(private payment: PaymentService) {}

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.isDataReady = false;
    const query: any = {};

    if (this.from) {
      query.dateFrom = new Date(this.from).toISOString();
    }

    if (this.to) {
      query.dateTo = new Date(this.to).toISOString();
    }

    this.payment
      .getRevenueTable({ ...query, isAdmin: true })
      .subscribe((res) => {
        this.tableData = res?.payload ?? [];
        this.isDataReady = true;
      });
  }
}
