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
} from '../../../shared/interfaces/course.interfaces';
import { faAngleRight, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { ModalService } from '@/src/app/core/services/modal.service';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-courses-categorize',
  templateUrl: './courses-categorize.component.html',
  styleUrl: './courses-categorize.component.scss',
  animations: [fadeInOutAnimation],
})
export class CoursesCategorizeComponent implements OnInit, AfterViewInit {
  @ViewChild('edit') editRef!: TemplateRef<any>;
  @ViewChild('initCourseByTag') initCourseByTagRef!: TemplateRef<any>;
  @ViewChild('addTag') addTagRef!: TemplateRef<any>;

  searchText = '';
  newTagName = '';

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

  isInitTagFinished: boolean = false;
  isShowCourse: boolean = false;

  constructor(
    private CourseService: CoursesService,
    private modal: ModalService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

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
  }

  onEdit(e: Event, data: ICourseTagData, idx: number) {
    e.stopPropagation();
    console.log(idx, data);
  }

  onInitData() {
    this.isInitTagFinished = false;
    this.CourseService.onGetTags().subscribe((res) => {
      if (!res?.payload) return;

      this.isInitTagFinished = true;
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
    this.CourseService.onSearchCourse(courseParams).subscribe((res) => {
      if (!res?.payload) return;

      this.coursesData = res.payload;
      this.isShowCourse = true;
    });
  }

  showAddTagModal() {
    this.modal.updateModalContent(this.addTagRef);
  }

  onSubmitAddTag() {
    if (this.newTagName.trim().length === 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.MISSING_FIELDS')
      );
      return;
    }

    this.newTagName = this.newTagName.replace(/\s+/g, '_').replace('#', '');
    this.CourseService.onAddTag(`${this.newTagName}`).subscribe((res) => {
      if (res?.isError) return;

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.CREATED_SUCCESSFULLY')
      );
      this.onInitData();
      this.modal.updateModalContent(null);
      this.newTagName = ''
    });
  }
}
