import {
  Component,
  ViewChild,
  type OnInit,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import {
  ICourseOverview,
  ICourseTagData,
  ISearchCourseParams,
  ITag,
  ITagCount,
} from '../../../shared/interfaces/course.interfaces';
import { faAngleRight, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-courses-categorize',
  templateUrl: './courses-categorize.component.html',
  styleUrl: './courses-categorize.component.scss',
  animations: [fadeInOutAnimation],
})
export class CoursesCategorizeComponent implements OnInit, AfterViewInit {
  @ViewChild('edit') editRef!: TemplateRef<any>;
  @ViewChild('initCourseByTag') initCourseByTagRef!: TemplateRef<any>;
  searchText = '';

  editIcon = faPen;
  addIcon = faPlus;

  rightIcon = faAngleRight;

  tagTableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'LABEL.TAGS',
    },
    {
      key: 'courses',
      label: 'LABEL.COURSES',
    },
  ];

  courseTableColumns: TableColumn[] = [
    {
      key: 'title',
      label: 'LABEL.COURSE_NAME',
    },
    {
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    // {
    //   key: 'tags',
    //   label: 'LABEL.TAGS',
    //   render: (data: ICourseTagData) =>
    //     data.tags.map((tag) => `#${tag.name}`).join(' '),
    // },
  ];

  tagsData: ITag[] = [];

  coursesData: ICourseOverview[] = [];

  isShowCourse: boolean = false

  constructor(private CourseService: CoursesService) {}

  ngOnInit(): void {
    this.onInitData();
  }

  ngAfterViewInit(): void {
    this.tagTableColumns = [
      ...this.tagTableColumns,
      {
        key: 'initCourseByTag',
        label: '',
        elementRef: this.initCourseByTagRef,
      },
    ];
    // this.courseTableColumns.push({
    //   key: 'actions',
    //   label: '',
    //   elementRef: this.editRef,
    // });
  }

  onEdit(e: Event, data: ICourseTagData, idx: number) {
    e.stopPropagation();
    console.log(idx, data);
  }

  onInitData() {
    this.CourseService.onGetTags().subscribe((res) => {
      if (!res?.payload) return;

      this.tagsData = res.payload;
    });
  }

  onConfirmSearchCourse(tag: ITag): void {
    const courseParams: ISearchCourseParams = {
      TagListId: [tag.id],
      pageNo: 1,
      eachPage: 10,
    };

    this.isShowCourse = false;
    this.CourseService.onSearchCourse(courseParams).subscribe(res => {
      if(!res?.payload) return;

      console.log(res.payload)
      this.coursesData = res.payload;
      this.isShowCourse = true;
    })
  }
}
