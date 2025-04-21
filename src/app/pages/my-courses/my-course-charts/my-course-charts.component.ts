import { Component, type OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IBarChartDataSet,
  ILineChartDataSet,
  IPieChartDataSet,
  IRadarChartDataSet,
} from '../../../shared/interfaces/chart.interface';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-my-course-charts',
  templateUrl: './my-course-charts.component.html',
  styleUrl: './my-course-charts.component.scss',
})
export class MyCourseChartsComponent implements OnInit {
  subscription$: Subscription = new Subscription();

  isLoadedSuccess: boolean = false;

  ratingsChartLabel: string[] = [];
  ratinsChartData: IBarChartDataSet[] = [];

  totalCourseLeanersLabel: string[] = [];
  totalCourseLeanersDataSet: ILineChartDataSet[] = [];

  learnerStatisticsLabel: string[] = [];
  leanerStatisticsData: IPieChartDataSet[] = [];

  top3CoursesLabels: string[] = ['Leaners', 'Rating (3 - 5)', 'Rating (1 - 3)'];
  top3CoursesDataSet: IRadarChartDataSet[] = [
    {
      label: 'ReactJS',
      data: [35, 120, 22],
    },
    {
      label: 'Typescript',
      data: [70, 85, 44],
    },
    {
      label: '.Net Fundamentals',
      data: [80, 90, 55], // learner, 3 - 5 *, 1 - 3 *
    },
  ];

  constructor(private course: CoursesService) {}

  ngOnInit(): void {
    this.initCharts();
  }

  initCharts() {
    this.course.onGetCourseOverviewStats().subscribe((res) => {
      if (!res?.payload) return;
      this.isLoadedSuccess = true;

      const { coursesEnroll, coursesReview, learnerStatus, topCourseInfo } =
        res.payload;

      this.totalCourseLeanersLabel = [];
      this.totalCourseLeanersDataSet = [
        {
          label: 'LABEL.LEARNERS',
          data: [],
        },
      ];
      coursesEnroll.forEach((stat) => {
        this.totalCourseLeanersLabel.push(stat.time);
        this.totalCourseLeanersDataSet[0].data.push(Number(stat.count));
      });

      this.ratingsChartLabel = [];
      this.ratinsChartData = [
        {
          label: 'LABEL.LEARNERS',
          data: [],
        },
      ];
      coursesReview.forEach((stat) => {
        this.ratingsChartLabel.push(stat.time);
        this.ratinsChartData[0].data.push(Number(stat.count));
      });

      this.learnerStatisticsLabel = [];
      this.leanerStatisticsData = [
        {
          label: `LABEL.LEARNERS`,
          data: [],
        },
      ];
      learnerStatus.forEach((stat) => {
        this.learnerStatisticsLabel.push(stat.status);
        this.leanerStatisticsData[0].data.push(Number(stat.count));
      });
    });
  }
}
