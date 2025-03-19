import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICourseOverview } from '../../../shared/interfaces/course.interfaces';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { IUser, IUserStat } from '../../../shared/interfaces/user.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss'],
})
export class InstructorProfileComponent implements OnInit, OnDestroy {
  @Input('user') user: IUser | null = null;
  @Input('isStaffView') isStaffView: boolean = false;

  subscription$: Subscription = new Subscription();

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
  star = faStar;
  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
