import { Component, OnInit } from '@angular/core';
import { ICourseOverview } from '../../../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-home-trending-courses',
  templateUrl: './home-trending-courses.component.html',
  styleUrls: ['./home-trending-courses.component.scss']
})
export class HomeTrendingCoursesComponent implements OnInit {
  sampleCourses: ICourseOverview[] = [
    {
      id: 'course1',
      title: 'Introduction to JavaScript',
      price: 15.99,
      author: 'Maxmilian Dopamine',
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      totalTime: 120, // minutes
      photoUrl: '/assets/images/demo-course-thumb.webp',
      createdBy: 'Maxmilian Dopamine',
      rating: 2.2,
      totalReview: 22531,
      totalLesson: 10,
      progress: -1, // %
      discountPrice: 0, 
    },
    {
      id: 'course1',
      title: 'Introduction to JavaScript',
      price: 15.99,
      author: 'Maxmilian Dopamine',
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      totalTime: 120, // minutes
      photoUrl: '/assets/images/demo-course-thumb.webp',
      createdBy: 'Maxmilian Dopamine',
      rating: 2.2,
      totalReview: 22531,
      totalLesson: 10,
      progress: -1, // %
      discountPrice: 0, 
    },
    {
      id: 'course1',
      title: 'Introduction to JavaScript',
      price: 15.99,
      author: 'Maxmilian Dopamine',
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      totalTime: 120, // minutes
      photoUrl: '/assets/images/demo-course-thumb.webp',
      createdBy: 'Maxmilian Dopamine',
      rating: 2.2,
      totalReview: 22531,
      totalLesson: 10,
      progress: -1, // %
      discountPrice: 0, 
    },
    {
      id: 'course1',
      title: 'Introduction to JavaScript',
      price: 15.99,
      author: 'Maxmilian Dopamine',
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      totalTime: 120, // minutes
      photoUrl: '/assets/images/demo-course-thumb.webp',
      createdBy: 'Maxmilian Dopamine',
      rating: 2.2,
      totalReview: 22531,
      totalLesson: 10,
      progress: -1, // %
      discountPrice: 0, 
    },
    {
      id: 'course1',
      title: 'Introduction to JavaScript',
      price: 15.99,
      author: 'Maxmilian Dopamine',
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      totalTime: 120, // minutes
      photoUrl: '/assets/images/demo-course-thumb.webp',
      createdBy: 'Maxmilian Dopamine',
      rating: 2.2,
      totalReview: 22531,
      totalLesson: 10,
      progress: -1, // %
      discountPrice: 0, 
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
