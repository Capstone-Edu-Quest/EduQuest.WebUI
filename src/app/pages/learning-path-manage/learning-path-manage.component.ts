import { Component, type OnInit } from '@angular/core';
import { ILearningPath } from '../../shared/interfaces/learning-path.interfaces';

@Component({
  selector: 'app-learning-path-manage',
  templateUrl: './learning-path-manage.component.html',
  styleUrl: './learning-path-manage.component.scss',
})
export class LearningPathManageComponent implements OnInit {

  demoLearningPaths: ILearningPath[] = [
    {
      id: '1',
      name: 'Frontend Development Mastery',
      description:
        'Learn HTML, CSS, JavaScript, and React to build modern web applications.',
      createdAt: '2025-02-07T08:00:00Z',
      updatedAt: '2025-02-07T08:30:00Z',
      isPublic: true,
      totalTime: 120, // in hours
      totalCourses: 4,
      createdBy: {
        id: '101',
        name: 'John Doe',
        avatar: 'https://example.com/avatars/john.png',
      },
      isEnrolled: false,
    },
    {
      id: '2',
      name: 'Backend with Node.js & Express',
      description:
        'Master backend development with Node.js, Express, and MongoDB.',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-02-01T10:45:00Z',
      isPublic: true,
      totalTime: 100,
      totalCourses: 4,
      createdBy: {
        id: '102',
        name: 'Jane Smith',
        avatar: 'https://example.com/avatars/jane.png',
      },
      isEnrolled: true,
    },
    {
      id: '3',
      name: 'Full-Stack with Angular & .NET',
      description:
        'Learn how to build scalable full-stack applications using Angular and .NET.',
      createdAt: '2024-12-10T15:30:00Z',
      updatedAt: '2025-01-20T14:20:00Z',
      isPublic: false,
      totalTime: 150,
      totalCourses: 4,
      createdBy: {
        id: '103',
        name: 'Alice Johnson',
        avatar: 'https://example.com/avatars/alice.png',
      },
      isEnrolled: false,
    },
    {
      id: '4',
      name: 'Blockchain Fundamentals',
      description:
        'Understand blockchain technology, smart contracts, and decentralized applications.',
      createdAt: '2024-11-05T10:10:00Z',
      updatedAt: '2024-12-15T11:00:00Z',
      isPublic: true,
      totalTime: 90,
      totalCourses: 4,
      createdBy: {
        id: '104',
        name: 'Bob Williams',
        avatar: 'https://example.com/avatars/bob.png',
      },
      isEnrolled: true,
    },
  ];

  ngOnInit(): void { }

}
