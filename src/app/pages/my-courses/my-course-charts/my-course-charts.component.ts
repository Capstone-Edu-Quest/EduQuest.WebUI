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
    },
  ];

  learnerStatisticsLabel: string[] = ['In Progress', 'Completed'];
  leanerStatisticsData: IPieChartDataSet[] = [
    {
      label: `LABEL.LEARNERS`,
      data: [50, 75],
    },
  ];

  top3CoursesLabels: string[] = ['Leaners', 'Rating (3 - 5)', 'Rating (1 - 3)'];
  top3CoursesDataSet: IRadarChartDataSet[] = [
    {
      label: 'ReactJS',
      data: [35, 120, 22], // Scores for each subject
    },
    {
      label: 'Typescript',
      data: [70, 85, 44], // Scores for another student
    },
    {
      label: '.Net Fundamentals',
      data: [80, 90, 55], // Scores for each subject
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
