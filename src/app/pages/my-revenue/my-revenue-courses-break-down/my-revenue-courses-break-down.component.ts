import { Component, type OnInit } from '@angular/core';
import {
  ICourseRevenueResponse,
  IGetRevenueItem,
  TableColumn,
} from '../../../shared/interfaces/others.interfaces';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { PaymentService } from '@/src/app/core/services/payment.service';
import { formatTime } from '@/src/app/core/utils/time.utils';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-revenue-courses-break-down',
  templateUrl: './my-revenue-courses-break-down.component.html',
  styleUrl: './my-revenue-courses-break-down.component.scss',
})
export class MyRevenueCoursesBreakDownComponent implements OnInit {
  tableColumns: TableColumn[] = [
    {
      key: 'title',
      label: 'LABEL.COURSE',
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
      label: 'LABEL.COMISSION_FEE',
      isMoney: true,
      customClass: () => 'red',
    },
    {
      key: 'instructorShare',
      label: 'LABEL.NET_VALUE',
      isMoney: true,
      customClass: () => 'green',
    },
    {
      key: 'isRefund',
      label: '',
      translateLabel: (val: IGetRevenueItem) => (val?.isRefund ? 'LABEL.REFUNDED' : ''),
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

    this.payment.getRevenueTable(query).subscribe((res) => {
      this.tableData = res?.payload ?? [];
      this.isDataReady = true;
    });
  }
}
