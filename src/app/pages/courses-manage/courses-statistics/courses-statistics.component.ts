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
      borderColor: '--brand-05',
      pointBackgroundColor: '--brand-hover',
      pointBorderColor: '--brand-light',
      backgroundColor: '--brand-05',
    },
    {
      label: 'LABEL.COURSES_ENROLLMENTS',
      data: [88, 121, 88, 99, 52],
      borderColor: '--info',
      pointBackgroundColor: '--stage-surface-locked',
      pointBorderColor: '--stage-surface-locked',
      backgroundColor: '--info',
    },
    {
      label: 'LABEL.NEW_COURSES',
      data: [2, 7, 5, 12, 2],
      borderColor: '--stage-surface-done',
      pointBackgroundColor: '--stage-body-done',
      pointBorderColor: '--stage-body-done',
      backgroundColor: '--stage-surface-done',
    },
  ];

  barChartLabels: string[] = ['#typescript', '#angular', '#react', '#vue', '#node', '#express',  '#mongodb', '#mysql', '#postgresql', '#firebase'];
  barChartData: IBarChartDataSet[] = [
    {
      label: 'LABEL.COURSES',
      data: [50, 75, 77, 53, 12, 22, 112, 123, 321, 641],
      borderColor: '--brand-05',
      hoverBackgroundColor: '--brand-light',
      hoverBorderColor: '--brand-05',
      backgroundColor: '--brand-hover',
    },
  ];

  trendingCourses: ITrendingCourse[] = [
    {
      id: "course-001",
      name: "Mastering React & TypeScript & Mastery of NextJS | 2025 Completed guide",
      author: {
        id: "author-101",
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      enrollments: 1200,
      tags: [
        { id: "tag-01", name: "React" },
        { id: "tag-02", name: "TypeScript" },
        { id: "tag-03", name: "Frontend" },
      ],
    },
    {
      id: "course-002",
      name: "AI & Machine Learning Fundamentals",
      author: {
        id: "author-102",
        name: "Jane Smith",
        avatar: null,
      },
      enrollments: 950,
      tags: [
        { id: "tag-04", name: "AI" },
        { id: "tag-05", name: "Machine Learning" },
        { id: "tag-06", name: "Data Science" },
      ],
    },
    {
      id: "course-003",
      name: "Ethical Hacking & Cybersecurity",
      author: {
        id: "author-103",
        name: "David Brown",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      enrollments: 875,
      tags: [
        { id: "tag-07", name: "Cybersecurity" },
        { id: "tag-08", name: "Ethical Hacking" },
        { id: "tag-09", name: "Networking" },
      ],
    },
    {
      id: "course-004",
      name: "UI/UX Design for Beginners",
      author: {
        id: "author-104",
        name: "Sophia Carter",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      enrollments: 820,
      tags: [
        { id: "tag-10", name: "UI/UX" },
        { id: "tag-11", name: "Figma" },
        { id: "tag-12", name: "Design" },
      ],
    },
    {
      id: "course-005",
      name: "Full-Stack Web Development Bootcamp",
      author: {
        id: "author-105",
        name: "Michael Scott",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      enrollments: 780,
      tags: [
        { id: "tag-13", name: "Full-Stack" },
        { id: "tag-14", name: "JavaScript" },
        { id: "tag-15", name: "MongoDB" },
      ],
    },
    {
      id: "course-001",
      name: "Mastering React & TypeScript & Mastery of NextJS | 2025 Completed guide",
      author: {
        id: "author-101",
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      enrollments: 1200,
      tags: [
        { id: "tag-01", name: "React" },
        { id: "tag-02", name: "TypeScript" },
        { id: "tag-03", name: "Frontend" },
      ],
    },
    {
      id: "course-001",
      name: "Mastering React & TypeScript & Mastery of NextJS | 2025 Completed guide",
      author: {
        id: "author-101",
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      enrollments: 1200,
      tags: [
        { id: "tag-01", name: "React" },
        { id: "tag-02", name: "TypeScript" },
        { id: "tag-03", name: "Frontend" },
      ],
    },
  ];

  userIcon = faUser;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onViewCourse(courseId: string): void {
    this.router.navigate(['/courses-manage', 'explore', courseId]);
  }
}
