import { Component, type OnInit } from '@angular/core';
import {
  ICourseRevenueResponse,
  TableColumn,
} from '../../../shared/interfaces/others.interfaces';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-my-revenue-courses-break-down',
  templateUrl: './my-revenue-courses-break-down.component.html',
  styleUrl: './my-revenue-courses-break-down.component.scss',
})
export class MyRevenueCoursesBreakDownComponent implements OnInit {
  tableColumns: TableColumn[] = [
    { key: 'title', label: 'LABEL.COURSE_NAME_REVENUE' },
    { key: 'totalSales', label: 'LABEL.TOTAL_SALES' },
    { key: 'totalRevenue', label: 'LABEL.TOTAL_REFUNDS' },
    // revenue = Total - Refund
    {
      key: 'totalRevenue',
      label: 'LABEL.TOTAL_REVENUE',
      isMoney: true,
    },
  ];

  isDataReady: boolean = false;

  tableData: ICourseRevenueResponse[] = [];

  constructor(private course: CoursesService) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.isDataReady = false;
    this.course.getMyCoursesRevenue().subscribe((res) => {
      this.tableData = res?.payload ?? [];
      this.isDataReady = true;
    });
  }
}
