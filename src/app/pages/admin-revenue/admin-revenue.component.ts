import { Component, type OnInit } from '@angular/core';
import {
  IGetRevenueItem,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { PaymentService } from '../../core/services/payment.service';
import { ILineChartDataSet } from '../../shared/interfaces/chart.interface';
import { TranslateService } from '@ngx-translate/core';
import { TransactionTypeEnum } from '../../shared/enums/others.enum';

@Component({
  selector: 'app-admin-revenue',
  templateUrl: './admin-revenue.component.html',
  styleUrl: './admin-revenue.component.scss',
})
export class AdminRevenueComponent implements OnInit {
  tableColumns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'type',
      label: 'LABEL.TYPE',
    },
    {
      key: 'learnerName',
      label: 'LABEL.USER',
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

  lineChartsLabel: string[] = [
    'May 2024',
    'Jun 2024',
    'Jul 2024',
    'Aug 2024',
    'Sep 2024',
  ];
  dataSet: ILineChartDataSet[] = [
    {
      label: this.translate.instant('LABEL.TOTAL'),
      data: [170, 65, 780, 232, 522],
    },
    {
      label: this.translate.instant('LABEL.COURSE'),
      data: [21, 42, 93, 74, 25, 68],
    },
    {
      label: this.translate.instant('LABEL.PACKAGES'),
      data: [9, 7, 12, 50, 5, 12],
    },
    {
      label: this.translate.instant('LABEL.PLATFORM_REVENUE'),
      data: [15, 24, 32, 45, 52, 61],
    },
  ];

  constructor(
    private payment: PaymentService,
    private translate: TranslateService
  ) {}

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
        this.onInitChart();
      });
  }

  onInitChart() {
    this.lineChartsLabel = this.lineChartsLabel.map((label) => {
      const date = new Date(label);
      return date.toLocaleString('default', { month: 'long' });
    });

    this.dataSet = [
      {
        label: this.translate.instant('LABEL.TOTAL'),
        data: this.tableData.map((item) => item.amount),
      },
      {
        label: this.translate.instant('LABEL.COURSE'),
        data: this.tableData.filter((item) => item.type === "Course").map((item) => item.amount),
      },
      {
        label: this.translate.instant('LABEL.PACKAGES'),
        data: this.tableData.filter((item) => item.type === 'Package').map((item) => item.amount),
      },
      {
        label: this.translate.instant('LABEL.PLATFORM_REVENUE'),
        data: this.tableData.map((item) => item.amount - (item.instructorShare || 0) - (item.stripeFee || 0)),
      },
    ];

    this.isDataReady = true;
  }
}
