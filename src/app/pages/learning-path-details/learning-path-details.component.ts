import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ILCourseObject,
  ILearningPathDetails,
} from '../../shared/interfaces/learning-path.interfaces';
import {
  faClock,
  faClone,
  faEarth,
  faGripVertical,
  faPen,
  faRetweet,
  faShare,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-learning-path-details',
  templateUrl: './learning-path-details.component.html',
  styleUrl: './learning-path-details.component.scss',
})
export class LearningPathDetailsComponent implements OnInit {
  learningPathDetails: ILearningPathDetails = {
    id: 'lp-001',
    name: 'Full-Stack Web Development',
    description:
      'A comprehensive path covering frontend, backend, and deployment.',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-02-01T10:30:00Z',
    isPublic: true,
    totalTime: 200, // Total hours
    totalCourses: 3,
    createdBy: {
      id: 'user-101',
      name: 'Alice Johnson',
      avatar: 'https://example.com/avatars/alice.png',
    },
    isEnrolled: true,
    courses: [
      {
        order: 1,
        course: {
          id: 'course-101',
          name: 'HTML & CSS Fundamentals',
          author: {
            id: 'user-201',
            name: 'John Doe',
            avatar: 'https://example.com/avatars/john.png',
          },
          description:
            'Learn the basics of HTML and CSS to build modern web pages.',
          duration: 20,
          stageCount: 5,
          image: '/assets/images/demo-course-thumb.webp',
          price: 29.99,
          createdDate: '2024-12-10T10:00:00Z',
          lastUpdated: '2025-01-15T12:00:00Z',
          rating: 4.7,
          numberOfRating: 800,
          isCompleted: true,
          progress: 100,
          tags: [
            { id: 'tag-1', name: 'HTML' },
            { id: 'tag-2', name: 'CSS' },
          ],
        },
      },
      {
        order: 2,
        course: {
          id: 'course-102',
          name: 'JavaScript & TypeScript',
          author: {
            id: 'user-202',
            name: 'Jane Smith',
            avatar: 'https://example.com/avatars/jane.png',
          },
          description:
            'Master JavaScript and TypeScript for frontend and backend development.',
          duration: 50,
          stageCount: 8,
          image: '/assets/images/demo-course-thumb.webp',
          price: 39.99,
          createdDate: '2024-11-20T09:00:00Z',
          lastUpdated: '2025-01-20T14:30:00Z',
          rating: 4.8,
          numberOfRating: 1200,
          isCompleted: false,
          progress: 60,
          tags: [
            { id: 'tag-3', name: 'JavaScript' },
            { id: 'tag-4', name: 'TypeScript' },
          ],
        },
      },
      {
        order: 3,
        course: {
          id: 'course-103',
          name: 'Backend with Node.js & Express',
          author: {
            id: 'user-203',
            name: 'Bob Williams',
            avatar: 'https://example.com/avatars/bob.png',
          },
          description:
            'Learn how to build RESTful APIs using Node.js and Express.',
          duration: 40,
          stageCount: 6,
          image: '/assets/images/demo-course-thumb.webp',
          price: 49.99,
          createdDate: '2024-10-15T14:30:00Z',
          lastUpdated: '2025-01-25T11:00:00Z',
          rating: 4.9,
          numberOfRating: 1500,
          isCompleted: false,
          progress: 25,
          tags: [
            { id: 'tag-5', name: 'Node.js' },
            { id: 'tag-6', name: 'Express' },
          ],
        },
      },
    ],
  };

  authorIcon = faUser;
  timeIcon = faClock;
  privacyIcon = faEarth;
  dragIcon = faGripVertical;
  swapIcon = faRetweet;

  isEdit: boolean = false;

  currentDragCourse: ILCourseObject | null = null;
  tempCourseList: ILCourseObject[] | null = null;
  tempEditMeta = {
    name: '',
    description: '',
    isPublic: this.learningPathDetails.isPublic,
  };

  pannelBtn = [
    {
      icon: faShare,
      label: 'LABEL.SHARE',
      action: () => this.onShare(),
    },
    {
      icon: faTrash,
      label: 'LABEL.ENROLL',
      action: () => this.onEnroll(),
    },
    {
      icon: faClone,
      label: 'LABEL.CLONE',
      action: () => this.onClone(),
    },
    {
      icon: faPen,
      label: 'LABEL.EDIT',
      action: () => this.onEdit(),
    },
    {
      icon: faTrash,
      label: 'LABEL.DELETE',
      action: () => this.onDelete(),
    },
  ];

  showingPannelBtn = [...this.pannelBtn];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if(this.route.snapshot.queryParams['edit']) {
      this.onEdit();
    }
  }

  onEnroll() {}

  onEdit() {
    this.isEdit = !this.isEdit;
    this.tempCourseList = this.learningPathDetails.courses;
    this.showingPannelBtn = this.showingPannelBtn.filter(
      (btn) => btn.label !== 'LABEL.EDIT'
    );

    this.tempEditMeta = {
      name: this.learningPathDetails.name,
      description: this.learningPathDetails.description,
      isPublic: this.learningPathDetails.isPublic,
    };
  }

  onEditPrivacy() {
    if (!this.isEdit) return;
    this.tempEditMeta.isPublic = !this.tempEditMeta.isPublic;
  }

  onSaveEdit() {
    this.learningPathDetails.courses = (
      this.tempCourseList as ILCourseObject[]
    ).map((c, i) => ({
      ...c,
      order: i,
    }));

    this.learningPathDetails.name = this.tempEditMeta.name;
    this.learningPathDetails.description = this.tempEditMeta.description;
    this.learningPathDetails.isPublic = this.tempEditMeta.isPublic;

    console.log(this.learningPathDetails);

    // Reset all edit attributes
    this.onCancelEdit();
  }

  onCancelEdit() {
    this.isEdit = false;
    this.tempCourseList = null;
    this.currentDragCourse = null;
    this.showingPannelBtn = this.pannelBtn;
  }

  onDelete() {}

  onClone() {}

  onShare() {}

  onDragStart(e: Event, course: ILCourseObject) {
    this.currentDragCourse = course;
  }

  onDragOver(e: Event) {
    e.preventDefault();
    // console.log(e);
  }

  onDrop(e: Event) {
    e.preventDefault();

    const droppedElement = e.target as HTMLElement;
    const droppedOnCourseId = droppedElement
      .closest('.course-wrapper')
      ?.getAttribute('courseId');

    if (this.tempCourseList) {
      const dropIndx = this.tempCourseList.findIndex(
        (c) => c.course.id === droppedOnCourseId
      );

      this.tempCourseList = this.tempCourseList.filter(
        (c) => c.course.id !== this.currentDragCourse?.course.id
      );

      this.tempCourseList = [
        ...this.tempCourseList.slice(0, dropIndx),
        this.currentDragCourse as ILCourseObject,
        ...this.tempCourseList.slice(dropIndx),
      ];
    }

    // console.log(this.tempCourseList, droppedOnCourseId);
    this.currentDragCourse = null;
  }
}
