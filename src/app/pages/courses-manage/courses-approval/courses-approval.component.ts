import {
  Component,
  ViewChild,
  type OnInit,
  ElementRef,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { ICourse } from '../../../shared/interfaces/course.interfaces';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { Router } from '@angular/router';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-courses-approval',
  templateUrl: './courses-approval.component.html',
  styleUrl: './courses-approval.component.scss',
})
export class CoursesApprovalComponent implements OnInit, AfterViewInit {
  @ViewChild('buttons') buttonsRef!: TemplateRef<any>;

  sampleCourses: ICourse[] = [
    {
      id: 'course1',
      name: 'Introduction to JavaScript',
      price: 15.99,
      author: {
        name: 'Maxmilian Dopamine',
      },
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      duration: 120, // hours,
      stageCount: 48,
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2023-05-01',
      lastUpdated: '2023-12-15',
      rating: 2.2,
      numberOfRating: 22531,
      isCompleted: false,
      progress: 35, // %
      tags: [
        {
          id: 'tag1',
          name: 'JavaScript',
          description: 'Programming language for the web',
        },
        { id: 'tag2', name: 'Beginner', description: 'Suitable for beginners' },
      ],
    },
    {
      id: 'course2',
      name: 'Mastering TypeScript',
      price: 15.99,
      description:
        'Deep dive into TypeScript and learn how to build robust, type-safe applications.',
      duration: 180,
      stageCount: 48,
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2023-03-10',
      lastUpdated: '2023-10-05',
      author: {
        name: 'Maxmilian Dopamine',
      },
      rating: 3.2,
      numberOfRating: 11253,
      isCompleted: true,
      progress: 100, // %
      tags: [
        {
          id: 'tag3',
          name: 'TypeScript',
          description: 'A superset of JavaScript',
        },
        {
          id: 'tag4',
          name: 'Advanced',
          description: 'For experienced developers',
        },
      ],
    },
    {
      id: 'course3',
      price: 15.99,
      name: 'HTML & CSS: Design and Build Websites',
      author: {
        name: 'Maxmilian Dopamine',
      },
      description: 'Create beautiful, responsive websites with HTML and CSS.',
      duration: 150,
      stageCount: 48,
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2022-11-20',
      lastUpdated: '2023-07-18',
      rating: 4.7,
      numberOfRating: 47281,
      isCompleted: false,
      progress: 50, // %
      tags: [
        { id: 'tag5', name: 'HTML', description: 'Hypertext Markup Language' },
        { id: 'tag6', name: 'CSS', description: 'Cascading Style Sheets' },
      ],
    },
    {
      id: 'course4',
      price: 12.99,
      stageCount: 48,
      name: 'React Fundamentals',
      author: {
        name: 'Maxmilian Dopamine',
      },
      description: 'Learn to build interactive web applications using React.',
      duration: 240,
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2023-01-15',
      lastUpdated: '2023-09-12',
      rating: 2.5,
      numberOfRating: 882,
      isCompleted: false,
      progress: 70, // %
      tags: [
        {
          id: 'tag7',
          name: 'React',
          description: 'A JavaScript library for building UI',
        },
        { id: 'tag8', name: 'Frontend', description: 'Frontend development' },
      ],
    },
    {
      id: 'course5',
      price: 15.99,
      stageCount: 48,
      author: {
        name: 'Maxmilian Dopamine',
      },
      name: 'Understanding APIs and RESTful Services',
      description: 'Learn how to work with APIs and build RESTful services.',
      duration: 200,
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2023-08-05',
      lastUpdated: '2023-11-01',
      rating: 4.7,
      numberOfRating: 123,
      isCompleted: false,
      progress: 20, // %
      tags: [
        {
          id: 'tag9',
          name: 'API',
          description: 'Application Programming Interface',
        },
        { id: 'tag10', name: 'Backend', description: 'Backend development' },
      ],
    },
  ];

  courses: ICourse[] = [];

  tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'LABEL.COURSE_NAME',
    },{
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    {
      key: 'instructor',
      label: 'LABEL.INSTRUCTOR',
      render: (c: ICourse) => c.author.name,
    },
    {
      key: 'price',
      label: 'LABEL.PRICE',
      isMoney: true,
    },
    {
      key: 'duration',
      label: 'LABEL.DURATION',
      translateLabel: 'SIGNATURE.HOURS'
    },
    {
      key: 'stageCount',
      label: 'LABEL.STAGES',
    },
  ];

  acceptIcon = faCheck;
  rejectIcon = faClose;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initCourses();
  }

  ngAfterViewInit(): void {
    this.initTableAction();
  }

  initTableAction() {
    this.tableColumns.push({
      key: 'btns',
      label: '',
      elementRef: this.buttonsRef,
    });
  }

  initCourses(): void {
    this.courses = this.sampleCourses;

    console.log(this.courses)
    this.initTableData();
  }

  onViewDetails(course: ICourse): void {
    this.router.navigate(['/courses-manage/explore', course.id]);
    console.log(course);
  }

  onReject(e: Event, data: ICourse) {
    e.stopPropagation();
    console.log(data)
  }

  onAccept(e: Event, data: ICourse) {
    e.stopPropagation();
    console.log(data)
  }

  initTableData() {}
}
