import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICourse } from '../../../shared/interfaces/course.interfaces';
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
  subscription$: Subscription = new Subscription();
  @Input('user') user: IUser | null = null;

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
      duration: 120, // minutes
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2023-05-01',
      lastUpdated: '2023-12-15',
      rating: 2.2,
      numberOfRating: 22531,
      isCompleted: false,
      progress: -1, // %
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
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2023-03-10',
      lastUpdated: '2023-10-05',
      author: {
        name: 'Maxmilian Dopamine',
      },
      rating: 3.2,
      numberOfRating: 11253,
      isCompleted: true,
      progress: -1, // %
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
      image: '/assets/images/demo-course-thumb.webp',
      createdDate: '2022-11-20',
      lastUpdated: '2023-07-18',
      rating: 4.7,
      numberOfRating: 47281,
      isCompleted: false,
      progress: -1, // %
      tags: [
        { id: 'tag5', name: 'HTML', description: 'Hypertext Markup Language' },
        { id: 'tag6', name: 'CSS', description: 'Cascading Style Sheets' },
      ],
    },
    {
      id: 'course4',
      price: 12.99,
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
      progress: -1, // %
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
      progress: -1, // %
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
  star = faStar;
  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
