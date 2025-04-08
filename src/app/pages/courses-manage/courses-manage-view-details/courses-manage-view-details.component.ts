import { UserService } from './../../../core/services/user.service';
import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IAssignment,
  ICourse,
  ICourseFullMetarialsView,
  IDocument,
  IMaterial,
  IQuiz,
  ITableMaterialData,
  IVideo,
} from '../../../shared/interfaces/course.interfaces';
import { AssignmentLanguageEnum } from '../../../shared/enums/materials.enum';
import {
  faAngleLeft,
  faAngleRight,
  faCheck,
  faCheckCircle,
  faClose,
  faHashtag,
  faPlus,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WebRole } from '../../../shared/enums/user.enum';
import { IUser } from '../../../shared/interfaces/user.interfaces';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-courses-manage-view-details',
  templateUrl: './courses-manage-view-details.component.html',
  styleUrl: './courses-manage-view-details.component.scss',
  animations: [fadeInOutAnimation],
})
export class CoursesManageViewDetailsComponent implements OnInit {
  subscription$: Subscription = new Subscription();

  backIcon = faAngleLeft;
  reqIcon = faCheckCircle;
  rightIcon = faAngleRight;
  addIcon = faPlus;

  user: IUser | null = null;

  exampleCourse: ICourseFullMetarialsView | null = null;

  tableColumns: TableColumn[] = [
    {
      key: 'lesson',
      label: 'LABEL.STAGES',
    },
    {
      key: 'name',
      label: 'LABEL.MATERIAL_NAME',
    },
    {
      key: 'type',
      label: 'LABEL.TYPE',
    },
    {
      key: 'description',
      label: 'LABEL.MATERIAL_DESCRIPTION',
    },
    {
      key: 'time',
      label: 'LABEL.TIME',
    },
    // {
    //   key: 'view',
    //   label: '',
    //   icon: this.rightIcon,
    // },
  ];
  materialsData: ITableMaterialData[] = [];

  course: ICourse | null = null;

  approvalMenu = [
    {
      icon: faCheck,
      label: 'LABEL.ACCEPT',
      action: (e: Event) => this.onAccept(e),
    },
    {
      icon: faClose,
      label: 'LABEL.REJECT',
      action: (e: Event) => this.onReject(e),
    },
  ];

  modifyMenu = [
    {
      icon: faHashtag,
      label: 'LABEL.MODIFY_HASHTAG',
      action: (e: Event) => this.onModifyHashtag(e),
    },
  ];

  staffMenu = [
    {
      icon: faWarning,
      label: 'LABEL.SUSPEND_COURSE',
      action: (e: Event) => this.onSuspendCourse(e),
    },
  ];

  menu: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private UserService: UserService,
    private CourseService: CoursesService
  ) {}

  ngOnInit(): void {
    this.initCourse();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((_user) => {
        this.user = _user;
      })
    );
  }

  initCourse = () => {
    const id = this.route.snapshot.paramMap.get('courseId');
    this.course = this.exampleCourse;

    if (!id) return;
    this.CourseService.onGetCourse(id).subscribe((res) => {
      if (!res?.payload) return;

      this.course = res.payload;
      this.onInitMaterialsData();
    });

    this.initMenu();
  };

  initMenu() {
    this.menu = [];

    // Check status = pending & expert
    if (this.user?.roleId === WebRole.EXPERT) {
      this.menu = [...this.approvalMenu];
    } else {
      this.menu = [...this.staffMenu];
    }

    this.menu.push(...this.modifyMenu);
  }

  onConverTime(time: string) {
    return new Date(time).toLocaleString();
  }

  async onInitMaterialsData() {
    if (!this.course) return;

    this.course.listLesson.forEach((lesson) => {
      lesson.materials.forEach((material) => {
        const materialData: ITableMaterialData = {
          name: material.title,
          lesson: lesson.index,
          type: material.type,
          description: material.description,
          time: material.duration,
        };

        this.materialsData.push(materialData);
      });
    });
  }

  onGetDataInfo(
    material: IMaterial<IVideo | IDocument | IQuiz | IAssignment>
  ): Promise<string> {
    return new Promise((resolve) => {
      switch (material.type) {
        case 'Video':
          this.translate
            .get('LABEL.QUESTIONS_COUNT', {
              value: (material.data as IVideo).questions.length,
            })
            .subscribe((res) => resolve(res));
          break;

        case 'Document':
          resolve('');
          break;

        case 'Quiz':
          this.translate
            .get('LABEL.QUESTIONS_COUNT', {
              value: (material.data as IQuiz).questions.length,
            })
            .subscribe((questions) => {
              const passingPercentages = (material.data as IQuiz)
                .passingPercentages;
              resolve(`${questions} | ${passingPercentages}%`);
            });
          break;

        case 'Assignment':
          resolve(
            `${(material.data as IAssignment).question} (${
              (material.data as IAssignment).answerLanguage
            })`
          );
          break;

        default:
          resolve('');
      }
    });
  }

  onGetDataTime(material: IMaterial<IVideo | IDocument | IQuiz | IAssignment>) {
    switch (material.type) {
      case 'Video':
        return this.translate.instant('SIGNATURE.MINUTES', {
          value: ((material.data as IVideo).duration / 60).toFixed(0),
        });
      case 'Document':
        return '';
      case 'Quiz':
        return this.translate.instant('SIGNATURE.MINUTES', {
          value: (material.data as IQuiz).timeLimit.toFixed(0),
        });
      case 'Assignment':
        return ``;
      default:
        return '';
    }
  }

  onAccept(e: Event) {
    e.stopPropagation();
    console.log('Accept');
  }

  onReject(e: Event) {
    e.stopPropagation();
    console.log('Decline');
  }

  onModifyHashtag(e: Event) {
    e.stopPropagation();
    console.log('Modify Hashtag');
  }

  onSuspendCourse(e: Event) {
    e.stopPropagation();
    console.log('Suspend Course');
  }

  onBack() {
    this.location.back();
    console.log('back');
  }
}
