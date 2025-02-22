import { Component, type OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  IMaterialCreate,
  IVideo,
} from '../../../shared/interfaces/course.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materials-video',
  templateUrl: './materials-video.component.html',
  styleUrl: './materials-video.component.scss',
})
export class MaterialsVideoComponent implements OnInit {
  addIcon = faPlus;
  clockIcon = faClock;
  editIcon = faPen;
  deleteIcon = faTrash;

  videoMaterials: IMaterialCreate<IVideo>[] = [
    {
      id: '1',
      name: 'Introduction to TypeScript',
      description:
        'A beginner-friendly introduction to TypeScript fundamentals.',
      type: 'video',
      data: {
        url: 'https://example.com/videos/typescript-intro.mp4',
        duration: 10, // 10 minutes
      },
    },
    {
      id: '2',
      name: 'React State Management',
      description:
        'Learn about state management in React using hooks and Redux.',
      type: 'video',
      data: {
        url: 'https://example.com/videos/react-state.mp4',
        duration: 15, // 15 minutes
      },
    },
    {
      id: '3',
      name: 'Understanding Asynchronous JavaScript',
      description:
        'Explore promises, async/await, and event loops in JavaScript.',
      type: 'video',
      data: {
        url: 'https://example.com/videos/async-js.mp4',
        duration: 12.5, // 12.5 minutes
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onCreate() {
    this.router.navigate(['/materials/video/new']);
  }

  onEdit(e: Event) {
    e.stopPropagation();
  }

  onDelete(e: Event) {
    e.stopPropagation();
  }
}
