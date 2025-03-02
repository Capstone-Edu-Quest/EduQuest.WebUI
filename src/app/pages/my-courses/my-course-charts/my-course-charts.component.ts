import { Component, type OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IBarChartDataSet,
  ILineChartDataSet,
  IPieChartDataSet,
  IRadarChartDataSet,
} from '../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-my-course-charts',
  templateUrl: './my-course-charts.component.html',
  styleUrl: './my-course-charts.component.scss',
})
export class MyCourseChartsComponent implements OnInit {
  subscription$: Subscription = new Subscription();

  ratingsChartLabel: string[] = ['1', '2', '3', '4', '5'];
  ratinsChartData: IBarChartDataSet[] = [
    {
      label: 'LABEL.LEARNERS',
      backgroundColor: '--brand',
      hoverBackgroundColor: '--brand-hover',
      borderColor: '--brand-02',
      hoverBorderColor: '--brand-01',
      data: [25, 50, 75, 100, 125],
    },
  ];

  totalCourseLeanersLabel: string[] = [
    'Oct 2024',
    'Nov 2024',
    'Dec 2024',
    'Jan 2025',
    'Feb 2025',
  ];
  totalCourseLeanersDataSet: ILineChartDataSet[] = [
    {
      label: 'LABEL.LEARNERS',
      data: [50, 75, 110, 120, 223],
      borderColor: '--brand-05',
      pointBackgroundColor: '--brand-hover',
      pointBorderColor: '--brand-light',
      backgroundColor: '--brand-05',
    },
  ];

  learnerStatisticsLabel: string[] = ['In Progress', 'Completed'];
  leanerStatisticsData: IPieChartDataSet[] = [
    {
      label: `LABEL.LEARNERS`,
      data: [50, 75],
      backgroundColor: ['--brand', '--brand-light'],
      hoverBackgroundColor: ['--brand', '--brand-light'],
      borderColor: '--brand-05',
    },
  ];

  top3CoursesLabels: string[] = ['Leaners', 'Rating (3 - 5)', 'Rating (1 - 3)'];
  top3CoursesDataSet: IRadarChartDataSet[] = [
    {
      label: 'ReactJS',
      data: [35, 120, 22], // Scores for each subject
      backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color
      borderColor: 'rgba(255, 99, 132, 1)', // Border color
      pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Points color
      pointBorderColor: '#fff', // Point border color
      pointHoverBackgroundColor: '#fff', // Hover background color
      pointHoverBorderColor: 'rgba(255, 99, 132, 1)', // Hover border color
    },
    {
      label: 'Typescript',
      data: [70, 85, 44], // Scores for another student
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
    },
    {
      label: '.Net Fundamentals',
      data: [80, 90, 55], // Scores for each subject
      backgroundColor: 'rgba(187, 224, 155, 0.2)', // Fill color
      borderColor: '#bbe09b', // Border color
      pointBackgroundColor: '#bbe09b', // Points color
      pointBorderColor: '#fff', // Point border color
      pointHoverBackgroundColor: '#fff', // Hover background color
      pointHoverBorderColor: '#bbe09b', // Hover border color
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
