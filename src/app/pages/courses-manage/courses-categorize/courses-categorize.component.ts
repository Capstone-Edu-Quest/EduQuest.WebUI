import {
  Component,
  ViewChild,
  type OnInit,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import {
  ICourse,
  ICourseTagData,
  ITagCount,
} from '../../../shared/interfaces/course.interfaces';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-courses-categorize',
  templateUrl: './courses-categorize.component.html',
  styleUrl: './courses-categorize.component.scss',
})
export class CoursesCategorizeComponent implements OnInit, AfterViewInit {
  @ViewChild('edit') editRef!: TemplateRef<any>;
  searchText = '';

  editIcon = faPen;
  addIcon = faPlus;

  tagTableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'LABEL.TAGS',
    },
    {
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    {
      key: 'numberOfCourses',
      label: 'LABEL.COURSES',
    },
  ];

  courseTableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'LABEL.COURSE_NAME',
    },
    {
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    {
      key: 'tags',
      label: 'LABEL.TAGS',
      render: (data: ICourseTagData) =>
        data.tags.map((tag) => `#${tag.name}`).join(' '),
    },
  ];

  tagsData: ITagCount[] = [
    {
      id: 'tag1',
      name: 'JavaScript',
      description: 'Programming language for the web',
      numberOfCourses: 12,
    },
    {
      id: 'tag2',
      name: 'Beginner',
      description: 'Suitable for beginners',
      numberOfCourses: 25,
    },
  ];

  coursesData: ICourseTagData[] = [
    {
      id: 'course1',
      name: 'Introduction to JavaScript',
      description:
        'Learn the fundamentals of JavaScript, the programming language of the web.',
      tags: [
        {
          id: 'tag1',
          name: 'JavaScript',
          description: 'Programming language for the web',
        },
        {
          id: 'tag2',
          name: 'Beginner',
          description: 'Suitable for beginners',
        },
      ],
    },
    {
      id: 'course2',
      name: 'Mastering TypeScript',
      description:
        'Deep dive into TypeScript and learn how to build robust, type-safe applications.',
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
  ];

  ngOnInit(): void {
    this.onInitData();
  }

  ngAfterViewInit(): void {
    this.courseTableColumns.push({
      key: 'actions',
      label: '',
      elementRef: this.editRef,
    });
  }

  onEdit(e: Event, data: ICourseTagData, idx: number) {
    e.stopPropagation();
    console.log(idx, data)
  }

  onInitData() {
    console.log(this.tagsData, this.coursesData);
  }

  onConfirmSearchCourse(e: KeyboardEvent): void {
    console.log('Search course:', this.searchText);
  }
}
