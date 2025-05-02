import { Component, type OnInit } from '@angular/core';
import {
  faBook,
  faBookMedical,
  faCheck,
  faPercent,
  faRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  IBarChartDataSet,
  ILineChartDataSet,
} from '../../../shared/interfaces/chart.interface';
import { ITrendingCourse } from '../../../shared/interfaces/course.interfaces';
import { Router } from '@angular/router';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';

@Component({
  selector: 'app-courses-statistics',
  templateUrl: './courses-statistics.component.html',
  styleUrl: './courses-statistics.component.scss',
  animations: [fadeInOutAnimation]
})
export class CoursesStatisticsComponent implements OnInit {
  statsItem = [
    {
      label: 'LABEL.TOTAL_COURSES',
      value: 1243,
      icon: faBook,
    },
    {
      label: 'LABEL.NEW_COURSES_THIS_MONTH',
      value: 23,
      icon: faBookMedical,
    },
    {
      label: 'LABEL.TOTAL_ENROLLMENTS',
      value: 1235,
      icon: faRightToBracket,
    },
    {
      label: 'LABEL.TOTAL_COURSES_COMPLETION',
      value: 523,
      icon: faCheck,
    },
    {
      label: 'LABEL.AVERAGE_COMPLETION_RATE',
      value: '62%',
      icon: faPercent,
    },
  ];

  graphLabels: string[] = [
    'Oct 2024',
    'Nov 2024',
    'Dec 2024',
    'Jan 2025',
    'Feb 2025',
  ];
  graphData: ILineChartDataSet[] = [
    {
      label: 'LABEL.COURSES_COMPLETION',
      data: [50, 75, 77, 53, 12],
    },
    {
      label: 'LABEL.COURSES_ENROLLMENTS',
      data: [88, 121, 88, 99, 52],
    },
    {
      label: 'LABEL.NEW_COURSES',
      data: [2, 7, 5, 12, 2],
    },
  ];

  barChartLabels: string[] = ['#typescript', '#angular', '#react', '#vue', '#node', '#express',  '#mongodb', '#mysql', '#postgresql', '#firebase'];
  barChartData: IBarChartDataSet[] = [
    {
      label: 'LABEL.COURSES',
      data: [50, 75, 77, 53, 12, 22, 112, 123, 321, 641],
    },
  ];

  trendingCourses: ITrendingCourse[] = [];

  userIcon = faUser;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onViewCourse(courseId: string): void {
    this.router.navigate(['/courses-manage', 'explore', courseId]);
  }
}
