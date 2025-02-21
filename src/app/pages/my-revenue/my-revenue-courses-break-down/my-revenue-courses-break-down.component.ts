import { Component, type OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';

@Component({
  selector: 'app-my-revenue-courses-break-down',
  templateUrl: './my-revenue-courses-break-down.component.html',
  styleUrl: './my-revenue-courses-break-down.component.scss',
})
export class MyRevenueCoursesBreakDownComponent implements OnInit {
  tableColumns: TableColumn[] = [
    { key: 'courseName', label: 'Course Name' },
    { key: 'totalLeaners', label: 'Total Leaners' },
    { key: 'totalRefund', label: 'Total Refunds' },
    // revenue = Total - Refund
    { key: 'totalRevenue', label: 'Total Revenue', isMoney: true },
  ];

  tableData = [
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
    {
      courseName: 'Mastering TypeScript',
      totalLeaners: (1232).toLocaleString(),
      totalRevenue: 11222,
      totalRefund: 12,
    },
    {
      courseName: 'C# from Scratch',
      totalLeaners: (8).toLocaleString(),
      totalRevenue: 80,
      totalRefund: 0
    },
  ];

  ngOnInit(): void {}
}
